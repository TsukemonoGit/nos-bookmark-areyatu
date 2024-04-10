import NDK, {
  NDKEvent,
  NDKNip07Signer,
  NDKUser,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import {
  EventPacket,
  ReqPacket,
  createRxBackwardReq,
  createRxNostr,
  latest,
  now,
  uniq,
  verify,
} from "rx-nostr";

import { extensionRelays, relaySearchRelays } from "./relays";
interface RelayList {
  read: string[];
  write: string[];
}

interface BookmarkEventList {
  kind10003: NostrEvent[];
  kind30003: { [id: string]: NostrEvent[] };
  kind30001: { [id: string]: NostrEvent[] };
}

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

  const rxReq = createRxBackwardReq();
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
  readRelayList: string[]
): Promise<BookmarkEventList> => {
  let res: BookmarkEventList = { kind10003: [], kind30001: {}, kind30003: {} };
  let timeoutId: NodeJS.Timeout;
  const timeoutMillis: number = 2000;
  const rxNostr = createRxNostr();

  //探すように有名どころのリレーとかも足す。
  const uniqueRelays = Array.from(
    new Set([...readRelayList, ...extensionRelays])
  );
  rxNostr.setDefaultRelays(uniqueRelays);

  const rxReq = createRxBackwardReq();
  const observable = rxNostr.use(rxReq).pipe(uniq(), verify());

  await new Promise<BookmarkEventList>((resolve, reject) => {
    const handleTimeout = () => {
      console.log("Timeout reached");
      subscription.unsubscribe(); // タイムアウト時に購読を解除
      resolve(res);
    };

    const observer = {
      next: (packet: EventPacket) => {
        console.log("Received:", packet);
        if (packet.event.kind === 10003) {
          res.kind10003.push(packet.event);
        } else if (packet.event.kind === 30003) {
          const id = packet.event.tags.find((item) => item[0] == "d");
          if (id) {
            if (!res.kind30003[id[1]]) res.kind30003[id[1]] = [];
            res.kind30003[id[1]].push(packet.event);
          }
        } else if (packet.event.kind === 30001) {
          const id = packet.event.tags.find((item) => item[0] == "d");
          if (id) {
            if (!res.kind30001[id[1]]) res.kind30001[id[1]] = [];
            res.kind30001[id[1]].push(packet.event);
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

    rxReq.emit({
      kinds: [10003, 30001, 30003],
      authors: [pubkey],
      until: now(),
    }); // 購読し始めてからイベントを受信するためにemitは後
  });

  return res;
};
