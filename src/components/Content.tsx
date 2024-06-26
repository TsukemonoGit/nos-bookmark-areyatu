import { Container } from "@suid/material";
import { createStore, unwrap } from "solid-js/store";
import SetPubkey from "./SetPubkey";
import Bookemarks from "./Bookmarks";
import { createSignal } from "solid-js";
import { NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk";
import {
  getUserRelayList,
  getBookmarkEventList,
  BookmarkEventList,
  RelayList,
  publishEventToRelay,
  checkPubkey,
  NostrEvent,
  getOnlineRelays,
} from "../libs/nostrFunctions";
//---------------------------------------------------------------------------
//てすとよう
//import bookmarkPackets from "../test/sortedBookmarksSocket.json"; // JSONファイルを読み込む
import PublishModal from "./Modals/PublishModal";
import { decode } from "../libs/nip19";
import OptionMenu from "./OptionMenu";
import { extensionRelays } from "../libs/relays";
import Form from "./Form";
//---------------------------------------------------------------------------
const nip07signer = new NDKNip07Signer();

export function Content({
  setToastState,
  setToastOpen,
  setNowProgress,
  nowProgress,
}: any) {
  const [pubkey, setPubkey] = createSignal("");
  const [secArray, setSecArray] = createSignal<Uint8Array | undefined>();
  const [publishEvent, setPublishEvent] = createSignal<NostrEvent | null>(null);
  const [publishModalOpen, setPublishModalOpen] = createSignal(false);
  const [apiRelays, setApiRelays] = createSignal<string[]>([]);
  const [userRelays, setUserRelays] = createStore<RelayList>({
    read: [],
    write: [],
  });

  const [bkmEvents, setBkmEvents] = createStore<BookmarkEventList>({
    kind10003: [],
    kind30003: {},
    kind30001: {},
  });

  const [optionValue, setOptionValue] = createSignal<number>(0);
  const relayLength = [30, 60, 200];
  //---------------------------------------------------------------------------
  // てすとよう
  //ファイルを同期で読み込む

  //setBkmEvents(bookmarkPackets as unknown as BookmarkEventList);

  //---------------------------------------------------------------------------
  const handleChange = (e: Event) => {
    setPubkey((e.target as HTMLInputElement).value);
    //console.log(e);
  };

  const handleSubmit = async (e: Event) => {
    if (nowProgress()) {
      return;
    }
    console.log(pubkey().length);
    if (!pubkey() || pubkey().length < 60) {
      setToastState({ message: "Check your public key", type: "error" });
      setToastOpen(true);
      setNowProgress(false);
      return;
    }

    setNowProgress(true);
    //初期化------------------
    setSecArray();
    setPublishEvent(null);
    setUserRelays({ read: [], write: [] });
    setBkmEvents({
      kind10003: [],
      kind30003: {},
      kind30001: {},
    });

    try {
      //-----------------------
      const res: { npubkey: string; nsecArray?: Uint8Array | undefined } =
        checkPubkey(pubkey());
      console.log(res);
      setPubkey(res.npubkey);
      if (res.nsecArray) {
        setSecArray(res.nsecArray);
      }

      if (pubkey().length < 63) {
        throw Error;
      }
    } catch (error) {
      setToastState({ message: "Check your public key", type: "error" });
      setToastOpen(true);
      setNowProgress(false);
      return;
    }
    if (optionValue() > 0 && apiRelays().length <= 0) {
      try {
        const tmpApiRelays = await getOnlineRelays();
        if (tmpApiRelays.length > 0) {
          setApiRelays(tmpApiRelays);
        }
      } catch (error) {
        console.log("failed to get online relays");
        setToastState({
          message:
            "Failed to get online relays. \n Please check the option to 'ひかえめ' or wait for a while and retry",
          type: "error",
        });
        setToastOpen(true);
        setNowProgress(false);
        return;
      }
    }
    try {
      const userRelayList = await getUserRelayList(
        decode(pubkey()).data as string
      );
      console.log(userRelayList);
      setUserRelays(userRelayList);
      if (userRelayList.read.length <= 0) {
        throw Error("Failed to get your relays");
      }
      const totalRelay = Array.from(
        new Set([
          ...userRelayList.read,
          ...userRelayList.write,
          ...extensionRelays,
          ...apiRelays(),
        ])
      );
      const bookmarkEventList = await getBookmarkEventList(
        decode(pubkey()).data as string,
        totalRelay,
        optionValue() < 3 ? relayLength[optionValue()] : totalRelay.length
      ); //できるだけリレー増やすためにリードもライトも含める
      if (
        bookmarkEventList.kind10003.length <= 0 &&
        Object.keys(bookmarkEventList.kind30001).length <= 0 &&
        Object.keys(bookmarkEventList.kind30003).length <= 0
      ) {
        throw Error("bookmarks not found");
      }
      console.log(bookmarkEventList);
      console.log(e);
      setBkmEvents(bookmarkEventList);
      setNowProgress(false);
    } catch (error: any) {
      setToastState({
        message: error.message || "error",
        type: "error",
      });
      setToastOpen(true);

      setNowProgress(false);
      console.log(error);
    }
  };

  const handleGetPubkey = async (e: Event) => {
    if (nowProgress()) {
      return;
    }

    try {
      setNowProgress(true);
      let NDKUser: NDKUser = await nip07signer.user();
      console.log(NDKUser.npub);
      setPubkey(NDKUser.npub);
    } catch (error) {
      console.log(error);
      setToastState({ message: "failed to get pubkey", type: "error" });
      setToastOpen(true);
    }
    setNowProgress(false);
  };

  const handleClickPublish = (nosEvent: NostrEvent) => {
    if (nowProgress()) {
      return;
    }
    console.log(nosEvent);
    setPublishEvent(nosEvent);
    setPublishModalOpen(true);
  };

  const handlePublishModalClose = async (content: string | undefined) => {
    //
    setPublishModalOpen(false);
    //
    console.log(content);

    if (nowProgress()) {
      return;
    }
    if (content === "publish") {
      setNowProgress(true);

      console.log(publishEvent());

      //relayチェック
      console.log(userRelays.write);
      if (userRelays.write) {
        try {
          //-----------------------
          const res: { npubkey: string; nsecArray?: Uint8Array | undefined } =
            checkPubkey(pubkey());
          console.log(res);
          setPubkey(res.npubkey);
          if (res.nsecArray) {
            setSecArray(res.nsecArray);
          }
        } catch (error) {
          setToastState({ message: "Check your public key", type: "error" });
          setToastOpen(true);
          setNowProgress(false);
          return;
        }
        const userRelayList = await getUserRelayList(
          decode(pubkey()).data as string
        );
        console.log(userRelayList);
        setUserRelays(userRelayList);
        if (userRelayList.read.length <= 0) {
          setToastState({
            message: "Failed to get your relays",
            type: "error",
          });
          setToastOpen(true);
          setNowProgress(false);
          return;
        }
      }

      try {
        const res: Map<string, boolean> = await publishEventToRelay(
          unwrap(publishEvent() as NostrEvent),
          userRelays.write,
          secArray()
        );
        let resString = "Published\n";
        for (const [relayUrl, isSuccess] of res.entries()) {
          resString += `${relayUrl}: ${isSuccess ? "Success" : "Failed"}\n`;
        }
        const hasSuccess = Array.from(res.values()).some(
          (isSuccess) => isSuccess
        );
        setToastState({
          message: resString,
          type: hasSuccess ? "success" : "error",
        });
        setToastOpen(true);
        setNowProgress(false);

        setPublishEvent(null);
      } catch (error: any) {
        setToastState({
          message: error.message ? error.message : "Failed to publish",
          type: "error",
        });
        console.log(error);
        setToastOpen(true);
        setNowProgress(false);
        setPublishEvent(null);
      }
    }

    setPublishModalOpen(false);
  };

  const optionHandleChange = (e: Event) => {
    setOptionValue(parseInt((e.target as HTMLInputElement).value));

    console.log(optionValue());
  };

  //------------------------------------------------------------
  return (
    <main>
      <Container maxWidth="lg">
        <OptionMenu
          optionHandleChange={optionHandleChange}
          optionValue={optionValue}
        />
        <SetPubkey
          pubkey={pubkey}
          onChange={handleChange}
          onSubmit={handleSubmit}
          getPubkey={handleGetPubkey}
          setBkmEvents={setBkmEvents}
          bkmEvents={bkmEvents}
          setToastState={setToastState}
          setToastOpen={setToastOpen}
        />

        <Bookemarks
          bookmarks={bkmEvents}
          handleClickPublish={handleClickPublish}
        />
      </Container>
      <PublishModal
        nosEvent={publishEvent}
        modalOpen={publishModalOpen}
        handleModalClose={handlePublishModalClose}
      />
    </main>
  );
}
