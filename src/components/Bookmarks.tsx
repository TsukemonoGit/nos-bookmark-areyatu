import { JSXElement, Match, Show, Switch, createSignal } from "solid-js";
import { BkmProps, BookmarkEventList } from "../libs/nostrFunctions";
import {
  Box,
  List,
  ListItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@suid/material";
import Kind10003 from "./Kind10003";
import Kind30001 from "./Kind30001";
import Kind30003 from "./Kind30003";
import JsonModal from "./Modals/JsonModal";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { EventPacket } from "rx-nostr";
import BkmBox from "./BkmBox";

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
      <Stack mt="1rem">
        <Typography variant="h5">
          The total number of bookmarks found for each type
        </Typography>
        <List>
          <ListItem sx={{ pt: 0.5, pb: 0 }}>
            kind10003:{bookmarks.kind10003.length}
          </ListItem>
          <ListItem sx={{ pt: 0.5, pb: 0 }}>
            kind30003:
            {Object.values(bookmarks.kind30003).reduce(
              (acc, curr) => acc + curr.length,
              0
            )}
          </ListItem>
          <ListItem sx={{ pt: 0.5, pb: 0 }}>
            kind30001:
            {Object.values(bookmarks.kind30001).reduce(
              (acc, curr) => acc + curr.length,
              0
            )}
          </ListItem>
        </List>
      </Stack>
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
            <BkmBox kind="10003">
              <Show when={bookmarks.kind10003.length > 0} fallback={"no data"}>
                <Kind10003
                  bookmarks={bookmarks}
                  handleClickEvent={handleClickEvent}
                  handleClickPublish={handleClickPublish}
                />
              </Show>
            </BkmBox>
          </Match>
          <Match when={selectedTab() === "kind30003"}>
            <BkmBox kind="30003">
              <Show
                when={
                  Object.values(bookmarks.kind30003).reduce(
                    (acc, curr) => acc + curr.length,
                    0
                  ) > 0
                }
                fallback={"no data"}
              >
                <Kind30003
                  bookmarks={bookmarks}
                  handleClickEvent={handleClickEvent}
                  handleClickPublish={handleClickPublish}
                />
              </Show>
            </BkmBox>
          </Match>
          <Match when={selectedTab() === "kind30001"}>
            <BkmBox kind="30001">
              <Show
                when={
                  Object.values(bookmarks.kind30001).reduce(
                    (acc, curr) => acc + curr.length,
                    0
                  ) > 0
                }
                fallback={"no data"}
              >
                <Kind30001
                  bookmarks={bookmarks}
                  handleClickEvent={handleClickEvent}
                  handleClickPublish={handleClickPublish}
                />
              </Show>
            </BkmBox>
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
