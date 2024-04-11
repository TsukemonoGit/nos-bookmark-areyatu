import { CircularProgress, Container } from "@suid/material";
import { createStore } from "solid-js/store";
import SetPubkey from "./SetPubkey";
import Bookemarks from "./Bookmarks";
import { JSXElement, Show, createSignal } from "solid-js";
import SelectedContent from "./SelectedContent";
import NDK, {
  NDKEvent,
  NDKNip07Signer,
  NDKUser,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import {
  getUserRelayList,
  getBookmarkEventList,
  BookmarkEventList,
  RelayList,
  publishEventToRelay,
  checkPubkey,
} from "../libs/nostrFunctions";
//---------------------------------------------------------------------------
//てすとよう
import bookmarkPackets from "../test/sortedBookmarksSocket.json"; // JSONファイルを読み込む
import PublishModal from "./Modals/PublishModal";
import { decode } from "../libs/nip19";
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
  //let user: NDKUser;
  //---------------------------------------------------------------------------
  // てすとよう
  //ファイルを同期で読み込む

  setBkmEvents(bookmarkPackets);

  //---------------------------------------------------------------------------
  const handleChange = (e: Event) => {
    setPubkey((e.target as HTMLInputElement).value);
    //console.log(e);
  };

  const handleSubmit = async (e: Event) => {
    try {
      setNowProgress(true);

      const res: { npubkey: string; nsecArray: Uint8Array | undefined } =
        checkPubkey(pubkey());
      console.log(res);
      setPubkey(res.npubkey);
      if (res.nsecArray) {
        setSecArray(res.nsecArray);
      }
      const userRelayList = await getUserRelayList(
        decode(res.npubkey).data as string
      );
      console.log(userRelayList);
      setUserRelays(userRelayList);
      const bookmarkEventList = await getBookmarkEventList(
        decode(res.npubkey).data as string,
        userRelayList.read
      );
      console.log(bookmarkEventList);
      console.log(e);
      setBkmEvents(bookmarkEventList);
      setNowProgress(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPubkey = async (e: Event) => {
    try {
      let NDKUser: NDKUser = await nip07signer.user();
      console.log(NDKUser.npub);
      setPubkey(NDKUser.npub);
    } catch (error) {
      console.log(error);
    }
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
        await publishEventToRelay(
          publishEvent() as NostrEvent,
          userRelays.write,
          secArray()
        );
        setNowProgress(false);
        setPublishEvent(null);
      } catch (error) {
        console.log(error);
      }
    }

    setPublishModalOpen(false);
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
    </main>
  );
}
