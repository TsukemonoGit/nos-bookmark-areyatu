import {
  EventPacket,
  RxNostr,
  createRxBackwardReq,
  createRxNostr,
  getSignedEvent,
  nip07Signer,
  now,
  seckeySigner,
  uniq,
  verify,
} from "rx-nostr";
import { extensionRelays, feedbackRelay, relaySearchRelays } from "./relays";
import { decode, npubEncode, nsecEncode } from "./nip19";
import { getPublicKey } from "./utils";
import { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { encrypt, generateSecretKey } from "./nip04";
export interface RelayList {
  read: string[];
  write: string[];
}
export interface BkmProps {
  bookmarks: BookmarkEventList;
  handleClickEvent: any;
  handleClickPublish: any;
}
export interface BookmarkEventList {
  kind10003: EventPacket[];
  kind30003: { [id: string]: EventPacket[] };
  kind30001: { [id: string]: EventPacket[] };
}
export type EventParameters = {
  created_at: number;
  content: string;
  tags: any[];
  kind: number;
  pubkey?: string;
  id?: string;
  sig?: string;
};
export type NostrEvent = {
  created_at: number;
  content: string;
  tags: any[];
  kind: number;
  pubkey: string;
  id: string;
  sig: string;
};

export const getUserRelayList = async (pubkey: string): Promise<RelayList> => {
  console.log(pubkey);
  let res: RelayList = { read: [], write: [] };
  let tmp_event: {
    kind3: NostrEvent | undefined;
    kind10002: NostrEvent | undefined;
  } = {
    kind3: undefined,
    kind10002: undefined,
  };
  let timeoutId: NodeJS.Timeout;
  const timeoutMillis: number = 2000;
  const rxNostr = createRxNostr();
  rxNostr.setDefaultRelays(relaySearchRelays);

  const rxReq = createRxBackwardReq("sup");
  const observable = rxNostr.use(rxReq).pipe(uniq(), verify());

  await new Promise<RelayList>((resolve, reject) => {
    const handleTimeout = () => {
      console.log("Timeout reached");
      subscription.unsubscribe(); // タイムアウト時に購読を解除
      resolve(res);
    };

    const observer = {
      next: (packet: EventPacket) => {
        console.log("Received:", packet);
        if (packet.event.kind === 3) {
          if (
            !tmp_event.kind3 ||
            packet.event.created_at > tmp_event.kind3.created_at
          ) {
            tmp_event.kind3 = packet.event;
          }
        } else if (packet.event.kind === 10002) {
          if (
            !tmp_event.kind10002 ||
            packet.event.created_at > tmp_event.kind10002.created_at
          ) {
            tmp_event.kind10002 = packet.event;
          }
        }
      },
      complete: () => {
        console.log("Completed!");
        clearTimeout(timeoutId); // 購読が完了したらタイムアウトのタイマーを解除
        resolve(res);
      },
      error: (error: any) => {
        console.error("Error:", error);
        clearTimeout(timeoutId); // エラーが発生したらタイムアウトのタイマーを解除
        reject(error);
      },
    };

    // 購読開始
    const subscription = observable.subscribe(observer);

    // タイムアウトのタイマーを設定
    timeoutId = setTimeout(handleTimeout, timeoutMillis);

    rxReq.emit(
      { kinds: [10002, 3], authors: [pubkey], until: now() },
      { relays: relaySearchRelays }
    ); // 購読し始めてからイベントを受信するためにemitは後
  });

  console.log(tmp_event);
  if (tmp_event.kind10002) {
    tmp_event.kind10002.tags.map((item) => {
      if (item.length === 2) {
        res.read.push(item[1]);
        res.write.push(item[1]);
      } else if (item[2] === "read") {
        res.read.push(item[1]);
      } else if (item[2] === "write") {
        res.write.push(item[1]);
      }
    });
  } else if (tmp_event.kind3) {
    try {
      const tmp_relay: {
        [relayURL: string]: { read: boolean; write: boolean };
      } = JSON.parse(tmp_event.kind3.content);
      Object.keys(tmp_relay).map((item: string) => {
        if (tmp_relay[item].read) {
          res.read.push(item);
        }
        if (tmp_relay[item].write) {
          res.write.push(item);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  return res;
};

export const getBookmarkEventList = async (
  pubkey: string,
  readRelayList: string[],
  maxRelayLength: number
): Promise<BookmarkEventList> => {
  let res: BookmarkEventList = { kind10003: [], kind30001: {}, kind30003: {} };

  const timeoutMillis: number = 1000; // タイムアウト時間（ミリ秒）
  const chunkSize = 30; // 一度に接続するrelayの数
  const uniqueRelays = readRelayList.slice(0, maxRelayLength);
  const totalChunks = Math.ceil(uniqueRelays.length / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const startIdx = i * chunkSize;
    const endIdx = Math.min((i + 1) * chunkSize, uniqueRelays.length);
    const chunkRelays = uniqueRelays.slice(startIdx, endIdx);

    await processChunk(pubkey, chunkRelays, res, timeoutMillis);
  }

  //時間順に並べ替えてから返す
  res = sortBookmarkEventList(res);
  return res;
};

const processChunk = async (
  pubkey: string,
  chunkRelays: string[],
  res: BookmarkEventList,
  timeoutMillis: number
) => {
  const rxNostr = createRxNostr();
  rxNostr.setDefaultRelays(chunkRelays);

  const rxReq = createRxBackwardReq("sub");
  const observable = rxNostr.use(rxReq).pipe(uniq(), verify());

  await new Promise<void>((resolve, reject) => {
    const handleTimeout = () => {
      console.log("Chunk processing timeout reached!");
      subscription.unsubscribe(); // タイムアウト時に購読を解除
      rxNostr.dispose();
      resolve();
    };

    const observer = {
      next: (packet: EventPacket) => {
        processPacket(packet, res);
      },
      complete: () => {
        console.log("Chunk processing completed!");
        clearTimeout(timeoutId); // 購読が完了したらタイムアウトのタイマーを解除
        rxNostr.dispose();
        resolve();
      },
      error: (error: any) => {
        console.error("Chunk processing error:", error);
        clearTimeout(timeoutId); // エラーが発生したらタイムアウトのタイマーを解除
        rxNostr.dispose();
        resolve();
      },
    };

    // 購読開始
    const subscription = observable.subscribe(observer);

    // タイムアウトのタイマーを設定
    const timeoutId = setTimeout(handleTimeout, timeoutMillis);

    rxReq.emit({
      kinds: [10003, 30001, 30003],
      authors: [pubkey],
      until: now(),
    });
  });
};

const processPacket = (packet: EventPacket, res: BookmarkEventList) => {
  if (
    packet.event.kind === 10003 &&
    !res.kind10003.find((item) => item.event.id === packet.event.id)
  ) {
    res.kind10003.push(packet);
  } else if (packet.event.kind === 30003) {
    const id = packet.event.tags.find((item) => item[0] == "d");
    if (id) {
      if (!res.kind30003[id[1]]) res.kind30003[id[1]] = [];
      if (
        !res.kind30003[id[1]].find((item) => item.event.id === packet.event.id)
      ) {
        res.kind30003[id[1]].push(packet);
      }
    }
  } else if (packet.event.kind === 30001) {
    const id = packet.event.tags.find((item) => item[0] == "d");
    if (id) {
      if (!res.kind30001[id[1]]) res.kind30001[id[1]] = [];
      if (
        !res.kind30001[id[1]].find((item) => item.event.id === packet.event.id)
      ) {
        res.kind30001[id[1]].push(packet);
      }
    }
  }
};

export function sortBookmarkEventList(
  bookmarkEventList: BookmarkEventList
): BookmarkEventList {
  const sortedBookmarkEventList: BookmarkEventList = {
    kind10003: sortEventsByCreatedAt(bookmarkEventList.kind10003),
    kind30003: {},
    kind30001: {},
  };
  // kind30003のIDをソートして新しいオブジェクトに追加
  Object.keys(bookmarkEventList.kind30003)
    .sort((a, b) => a.localeCompare(b))
    .forEach((id) => {
      sortedBookmarkEventList.kind30003[id] = bookmarkEventList.kind30003[id];
    });

  // kind30001のIDをソートして新しいオブジェクトに追加
  Object.keys(bookmarkEventList.kind30001)
    .sort((a, b) => a.localeCompare(b))
    .forEach((id) => {
      sortedBookmarkEventList.kind30001[id] = bookmarkEventList.kind30001[id];
    });
  // kind30003の各配列をcreated_atの値で並べ替える
  Object.keys(bookmarkEventList.kind30003).forEach((id) => {
    sortedBookmarkEventList.kind30003[id] = sortEventsByCreatedAt(
      bookmarkEventList.kind30003[id]
    );
  });

  // kind30001の各配列をcreated_atの値で並べ替える
  Object.keys(bookmarkEventList.kind30001).forEach((id) => {
    sortedBookmarkEventList.kind30001[id] = sortEventsByCreatedAt(
      bookmarkEventList.kind30001[id]
    );
  });

  return sortedBookmarkEventList;
}

function sortEventsByCreatedAt(packets: EventPacket[]): EventPacket[] {
  return packets.sort((a, b) => {
    return b.event.created_at - a.event.created_at;
  });
}

export async function publishEventToRelay(
  event: NostrEvent,
  relay: string[],
  nsec?: Uint8Array
): Promise<Map<string, boolean>> {
  if (relay.length <= 0) {
    //todo 書き込みリレー見つかってないときどうする
    throw Error("Relay is not set");
  }
  const eventParams: EventParameters = {
    created_at: Math.floor(Date.now() / 1000),
    content: event.content,
    tags: event.tags,
    kind: event.kind,
  };
  // event.created_at = Math.floor(Date.now() / 1000);
  // event.id = "";
  // event.sig = "";
  console.log("eventParams:", eventParams);
  // if (nsec !== undefined) {
  //   newEvent.pubkey = getPublicKey(nsec);
  // }
  //console.log("nsec:", nsec);
  const signer =
    nsec !== undefined ? seckeySigner(nsecEncode(nsec)) : nip07Signer();
  //console.log(signer);
  const rxNostr = createRxNostr({
    signer: signer,
  });

  const publishEvent = await signer.signEvent(eventParams); //error
  console.log("signedEvent:", publishEvent);

  try {
    const result = await sendEventToRelay(rxNostr, publishEvent, relay);

    console.log("送信結果:", result);
    return result;
  } catch (error) {
    console.error("イベントの送信中にエラーが発生しました:", error);
    throw Error;
  }

  // return new Map();
}

// rxNostr.sendをPromise化する関数
async function sendEventToRelay(
  rxNostr: RxNostr,
  event: EventParameters,
  relays: string[]
): Promise<Map<string, boolean>> {
  return new Promise<Map<string, boolean>>((resolve, reject) => {
    const res: Map<string, boolean> = new Map();

    const handleTimeout = () => {
      console.log("Timeout reached");
      resolve(res);
    };

    const subscription = rxNostr.send(event, { relays }).subscribe((packet) => {
      console.log(
        `リレー ${packet.from} への送信が ${
          packet.ok ? "成功" : "失敗"
        } しました。`
      );
      res.set(packet.from, packet.ok);

      // すべてのリレーへの送信が完了したら、Observableを完了させる
      if (res.size === relays.length) {
        subscription.unsubscribe(); // Observableの購読を解除
        resolve(res); // Promiseを解決
      }
    });

    setTimeout(handleTimeout, 5000); // タイムアウトの設定
  });
}

export function checkPubkey(str: string): {
  npubkey: string;
  nsecArray?: Uint8Array;
} {
  console.log(str);
  let res: { npubkey: string; nsecArray?: Uint8Array } = { npubkey: "" };
  if (!str || str.length < 60) {
    throw Error;
  }
  try {
    if (str.startsWith("nostr:")) {
      str = str.slice(6);
    }
    // npubかhexかnsec
    if (str.startsWith("npub")) {
      decode(str).data as string; // decodeしてエラーにならないかチェック
      res.npubkey = str;
      // nsecかhex
    } else if (str.startsWith("nsec")) {
      const sec = decode(str).data as Uint8Array;
      res.nsecArray = sec;
      res.npubkey = npubEncode(getPublicKey(sec));
      console.log(res);
      // hex
    } else {
      res.npubkey = npubEncode(str);
    }
    console.log(res);
    return res;
  } catch (error) {
    throw Error;
  }
}

export async function getOnlineRelays(): Promise<string[]> {
  try {
    const response = await fetch("https://api.nostr.watch/v1/online");
    if (!response.ok) {
      throw new Error("Failed to fetch relay list");
    }
    const data: string[] = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching relay list:", error);
    throw Error;
  }
}
//vite  import.meta.env.VITE_FORMSEND_PUBHEX

export async function sendMessage(message: string, pubhex: string) {
  if (pubhex) {
    const sk = generateSecretKey();
    const pk = getPublicKey(sk);
    const encryptedMessage = await encrypt(sk, pubhex, message);

    const ev = {
      kind: 4,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["p", pubhex]],

      content: encryptedMessage,
      pubkey: pk,
    };
    const signer = seckeySigner(nsecEncode(sk));
    //console.log(signer);
    const rxNostr = createRxNostr({
      signer: signer,
    });
    try {
      const result = await sendEventToRelay(rxNostr, ev, feedbackRelay);

      console.log("送信結果:", result);
      return result;
    } catch (error) {
      console.error("イベントの送信中にエラーが発生しました:", error);
      throw Error;
    }
  } else {
    throw Error;
  }
}

export const isNostrEvent = (obj: any): obj is NostrEvent => {
  return (
    typeof obj === "object" &&
    typeof obj.created_at === "number" &&
    typeof obj.content === "string" &&
    Array.isArray(obj.tags) &&
    typeof obj.kind === "number" &&
    typeof obj.pubkey === "string" &&
    typeof obj.id === "string" &&
    typeof obj.sig === "string"
  );
};
