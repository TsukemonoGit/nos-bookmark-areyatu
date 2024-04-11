import { Container } from "@suid/material";
import { createStore } from "solid-js/store";
import SetPubkey from "./SetPubkey";
import Bookemarks from "./Bookmarks";
import Kind10003 from "./Kind10003";
import Kind30001 from "./Kind30001";
import Kind30003 from "./Kind30003";
import { JSXElement, createSignal } from "solid-js";
import SelectedContent from "./SelectedContent";
import NDK, { NDKEvent, NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk";
import {
  getUserRelayList,
  getBookmarkEventList,
  BookmarkEventList,
} from "../libs/nostrFunctions";

//てすとよう
import bookmarks from "../test/sortedBookmarks.json"; // JSONファイルを読み込む
const nip07signer = new NDKNip07Signer();

export function Content(): JSXElement {
  const [pubkey, setPubkey] = createSignal("");
  const [userRelays, setUserRelays] = createStore();

  const [bkmEvents, setBkmEvents] = createStore<BookmarkEventList>({
    kind10003: [],
    kind30001: {},
    kind30003: {},
  });
  const [selectedEventNum, setSelectedEventNum] = createSignal();
  let user: NDKUser;
  //---------------------------------------------------------------------------
  // てすとよう
  //ファイルを同期で読み込む

  setBkmEvents(bookmarks);

  //---------------------------------------------------------------------------
  const handleChange = (e: Event) => {
    setPubkey((e.target as HTMLInputElement).value);
    //console.log(e);
  };

  const handleSubmit = async (e: Event) => {
    const userRelayList = await getUserRelayList(user.pubkey);
    console.log(userRelayList);
    setUserRelays(userRelayList);
    const bookmarkEventList = await getBookmarkEventList(
      user.pubkey,
      userRelayList.read
    );
    console.log(bookmarkEventList);
    console.log(e);
    setBkmEvents(bookmarkEventList);
  };

  const handleGetPubkey = async (e: Event) => {
    try {
      let NDKUser: NDKUser = await nip07signer.user();
      console.log(NDKUser.npub);
      setPubkey(NDKUser.npub);
      user = NDKUser;
    } catch (error) {
      console.log(error);
    }
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
        <div>{pubkey()}</div>
        <Bookemarks>
          <Kind10003 bookmarks={bkmEvents} />
          <Kind30003 bookmarks={bkmEvents} />
          <Kind30001 bookmarks={bkmEvents} />
        </Bookemarks>
        <SelectedContent selectedEventNum={selectedEventNum} />
      </Container>
    </main>
  );
}
