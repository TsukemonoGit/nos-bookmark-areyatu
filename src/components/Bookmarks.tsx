import { JSXElement, Match, Switch, createSignal } from "solid-js";
import { BkmProps, BookmarkEventList } from "../libs/nostrFunctions";
import { Box, ToggleButton, ToggleButtonGroup } from "@suid/material";
import Kind10003 from "./Kind10003";
import Kind30001 from "./Kind30001";
import Kind30003 from "./Kind30003";
import JsonModal from "./Modals/JsonModal";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { EventPacket } from "rx-nostr";

interface Props {
  bookmarks: BookmarkEventList;
  handleClickPublish: any;
}
export default function Bookemarks({ bookmarks, handleClickPublish }: Props) {
  const [selectedTab, setSelectedTab] = createSignal("kind10003");
  const [modalOpen, setModalOpen] = createSignal(false);
  const [clickedEvent, setClickedEvent] = createSignal<EventPacket | null>(
    null
  );
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

  const handleClickEvent = (nosEvent: EventPacket) => {
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
        <ToggleButtonGroup
          color="primary"
          value={selectedTab()}
          exclusive
          onChange={(event, newAlignment) => {
            handleTabChange(newAlignment);
          }}
        >
          <ToggleButton value="kind10003">kind10003</ToggleButton>
          <ToggleButton value="kind30003">kind30003</ToggleButton>
          <ToggleButton value="kind30001">kind30001</ToggleButton>
        </ToggleButtonGroup>
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
              handleClickEvent={handleClickEvent}
              handleClickPublish={handleClickPublish}
            />
          </Match>
          <Match when={selectedTab() === "kind30003"}>
            <Kind30003
              bookmarks={bookmarks}
              handleClickEvent={handleClickEvent}
              handleClickPublish={handleClickPublish}
            />
          </Match>
          <Match when={selectedTab() === "kind30001"}>
            <Kind30001
              bookmarks={bookmarks}
              handleClickEvent={handleClickEvent}
              handleClickPublish={handleClickPublish}
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
