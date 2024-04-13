import { Box, CircularProgress, Container } from "@suid/material";
import { createStore, unwrap } from "solid-js/store";
import SetPubkey from "./SetPubkey";
import Bookemarks from "./Bookmarks";
import { JSXElement, Show, createSignal } from "solid-js";
import SelectedContent from "./SelectedContent";
import { NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk";
import {
  getUserRelayList,
  getBookmarkEventList,
  BookmarkEventList,
  RelayList,
  publishEventToRelay,
  checkPubkey,
  NostrEvent,
} from "../libs/nostrFunctions";
//---------------------------------------------------------------------------
//てすとよう
//import bookmarkPackets from "../test/sortedBookmarksSocket.json"; // JSONファイルを読み込む
import PublishModal from "./Modals/PublishModal";
import { decode } from "../libs/nip19";
import Toast from "./Modals/Toast";
//---------------------------------------------------------------------------
const nip07signer = new NDKNip07Signer();

export function Content(): JSXElement {
  const [pubkey, setPubkey] = createSignal("");
  const [secArray, setSecArray] = createSignal<Uint8Array | undefined>();
  const [publishEvent, setPublishEvent] = createSignal<NostrEvent | null>(null);
  const [publishModalOpen, setPublishModalOpen] = createSignal(false);
  const [nowProgress, setNowProgress] = createSignal(false);
  const [userRelays, setUserRelays] = createStore<RelayList>({
    read: [],
    write: [],
  });

  const [bkmEvents, setBkmEvents] = createStore<BookmarkEventList>({
    kind10003: [],
    kind30003: {},
    kind30001: {},
  });

  const [toastOpen, setToastOpen] = createSignal<boolean>();

  const [toastState, setToastState] = createSignal<{
    message: string;
    type: "success" | "info" | "warning" | "error";
  }>({
    message: "",
    type: "info",
  });

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

    try {
      const userRelayList = await getUserRelayList(
        decode(pubkey()).data as string
      );
      console.log(userRelayList);
      setUserRelays(userRelayList);
      if (userRelayList.read.length <= 0) {
        throw Error("Failed to get your relays");
      }
      const bookmarkEventList = await getBookmarkEventList(
        decode(pubkey()).data as string,
        Array.from(new Set([...userRelayList.read, ...userRelayList.write]))
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
    setNowProgress(true);
    try {
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
    console.log(nosEvent);
    setPublishEvent(nosEvent);
    setPublishModalOpen(true);
  };

  const handlePublishModalClose = async (content: string | undefined) => {
    console.log(content);
    if (nowProgress()) {
      return;
    }
    if (content === "publish") {
      setNowProgress(true);
      console.log(publishEvent());
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

  const handleToastClose = () => {
    setToastOpen(false);
  };

  //------------------------------------------------------------
  return (
    <main>
      <Container maxWidth="lg">
        <SetPubkey
          pubkey={pubkey}
          onChange={handleChange}
          onSubmit={handleSubmit}
          getPubkey={handleGetPubkey}
        />

        <Bookemarks
          bookmarks={bkmEvents}
          handleClickPublish={handleClickPublish}
        />

        {/* <SelectedContent selectedEvent={selectedEvent} /> */}
      </Container>
      <PublishModal
        nosEvent={publishEvent}
        modalOpen={publishModalOpen}
        handleModalClose={handlePublishModalClose}
      />

      <Show when={nowProgress()}>
        <CircularProgress
          color="secondary"
          sx={{ position: "fixed", bottom: 10, right: 10 }}
          size={100}
        />
      </Show>
      <Toast
        timeout={5}
        toastOpen={toastOpen}
        handleToastClose={handleToastClose}
        toastState={toastState}
      />
    </main>
  );
}
