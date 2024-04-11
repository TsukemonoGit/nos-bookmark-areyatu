import { For, Show } from "solid-js";
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
} from "@suid/material";

export default function Kind30003(props: BkmProps) {
  const handleChange = (_event: any, value: string): void => {
    console.log("_event:", _event);
    console.log("value:", value);
  };
  return (
    <div>
      kind:30003
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
          <For each={Object.keys(props.bookmarks.kind30003)}>
            {(id, i) => (
              <Box
                sx={{
                  p: 1,
                  border: 1,
                  borderColor: (theme: Theme) => theme.palette.primary.main,
                }}
              >
                <div>{id}</div>

                <For each={props.bookmarks.kind30003[id]}>
                  {(event, index) => (
                    <div>
                      <FormControlLabel
                        value={id + index()}
                        control={<Radio />}
                        label={new Date(
                          event.created_at * 1000
                        ).toLocaleString()}
                      />
                      <div>
                        tags.length:
                        {event.tags.length},content.length:
                        {event.content.length}
                      </div>
                      <Button onClick={() => props.handleClickEvent(event)}>
                        もっとみる
                      </Button>
                      <Show
                        when={
                          props.bookmarks.kind30003[id].length > index() + 1
                        }
                      >
                        <Divider />
                      </Show>
                    </div>
                  )}
                </For>
              </Box>
            )}
          </For>{" "}
        </RadioGroup>{" "}
      </FormControl>
    </div>
  );
}
