import { For, Show, createSignal } from "solid-js";
import { BookmarkEventList, BkmProps } from "../libs/nostrFunctions";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Theme,
  useTheme,
} from "@suid/material";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import JsonModal from "./Modals/JsonModal";
import EventItem from "./EventItem";

export default function Kind10003(props: BkmProps) {
  const handleChange = (_event: any, value: string): void => {
    console.log("_event:", _event);
    console.log("value:", value);
  };

  return (
    <>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        onChange={handleChange}
      >
        <For each={props.bookmarks.kind10003}>
          {(nosevent, index) => (
            <div>
              <EventItem
                nosEvent={nosevent}
                handleClickEvent={props.handleClickEvent}
                handleClickPublish={props.handleClickPublish}
                value={index().toString()}
              />
              <Show when={props.bookmarks.kind10003.length > index() + 1}>
                <Divider />
              </Show>
            </div>
          )}
        </For>
      </RadioGroup>
    </>
  );
}
