import { For, Show, createSignal } from "solid-js";
import { BookmarkEventList, BkmProps } from "../libs/nostrFunctions";
import {
  Box,
  Button,
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
import JsonModal from "./JsonModal";

export default function Kind10003(props: BkmProps) {
  const handleChange = (_event: any, value: string): void => {
    console.log("_event:", _event);
    console.log("value:", value);
  };

  return (
    <div>
      <div>kind:10003</div>
      <Box
        sx={{
          p: 1,
          border: 1,
          borderColor: (theme: Theme) => theme.palette.primary.main,
        }}
      >
        <FormControl
          sx={{
            p: 1,
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={handleChange}
          >
            <For each={props.bookmarks.kind10003}>
              {(event, index) => (
                <div>
                  <FormControlLabel
                    value={index()}
                    control={<Radio />}
                    label={new Date(event.created_at * 1000).toLocaleString()}
                  />
                  <div>
                    tags.length:
                    {event.tags.length},content.length:
                    {event.content.length}
                  </div>
                  <Button onClick={() => props.handleClickEvent(event)}>
                    もっとみる
                  </Button>
                  <Show when={props.bookmarks.kind10003.length > index() + 1}>
                    <Divider />
                  </Show>
                </div>
              )}
            </For>
          </RadioGroup>
        </FormControl>
      </Box>
    </div>
  );
}
