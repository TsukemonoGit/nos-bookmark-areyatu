import { JSXElement, Match, Switch, createSignal } from "solid-js";
import { BkmProps, BookmarkEventList } from "../libs/nostrFunctions";
import { Box, Button, ButtonGroup } from "@suid/material";
import Kind10003 from "./Kind10003";
import Kind30001 from "./Kind30001";
import Kind30003 from "./Kind30003";
import JsonModal from "./JsonModal";
import { NostrEvent } from "@nostr-dev-kit/ndk";

interface Props {
  bookmarks: BookmarkEventList;
  onSelect: any;
}
export default function Bookemarks({ bookmarks, onSelect }: Props) {
  const [selectedTab, setSelectedTab] = createSignal("kind10003");
  const [modalOpen, setModalOpen] = createSignal(false);
  const [clickedEvent, setClickedEvent] = createSignal<NostrEvent | null>(null);

  const handleTabChange = (tabName: string) => {
    setSelectedTab(tabName);
  };

  // kind30001のNostrEvent配列を取得し、要素数を合計する
  const totalKind30001 = Object.values(bookmarks.kind30001).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  // kind30003のNostrEvent配列を取得し、要素数を合計する
  const totalKind30003 = Object.values(bookmarks.kind30003).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  const handleModalClose = () => {
    setClickedEvent(null);
    setModalOpen(false);
  };

  const handleClickEvent = (nosEvent: NostrEvent) => {
    setClickedEvent(nosEvent);
    setModalOpen(true);
  };

  return (
    <>
      <h3>The total number of bookmarks found for each type</h3>
      <ul>
        <li>kind10003:{bookmarks.kind10003.length}</li>
        <li>kind30003:{totalKind30003}</li>
        <li>kind30001:{totalKind30001}</li>
      </ul>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Button onClick={() => handleTabChange("kind10003")}>
            kind10003
          </Button>
          <Button onClick={() => handleTabChange("kind30003")}>
            kind30003
          </Button>
          <Button onClick={() => handleTabChange("kind30001")}>
            kind30001
          </Button>
        </ButtonGroup>
        {/* <ButtonGroup variant="text" aria-label="text button group">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <Switch fallback={<div>Not Found</div>}>
          <Match when={selectedTab() === "kind10003"}>
            <Kind10003
              bookmarks={bookmarks}
              onSelect={onSelect}
              handleClickEvent={handleClickEvent}
            />
          </Match>
          <Match when={selectedTab() === "kind30003"}>
            <Kind30003
              bookmarks={bookmarks}
              onSelect={onSelect}
              handleClickEvent={handleClickEvent}
            />
          </Match>
          <Match when={selectedTab() === "kind30001"}>
            <Kind30001
              bookmarks={bookmarks}
              onSelect={onSelect}
              handleClickEvent={handleClickEvent}
            />
          </Match>
        </Switch>
      </Box>
      <JsonModal
        nosEvent={clickedEvent}
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
      />
    </>
  );
}
