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
import EventItem from "./EventItem";

export default function Kind30003(props: BkmProps) {
  const handleChange = (_event: any, value: string): void => {
    console.log("_event:", _event);
    console.log("value:", value);
  };
  return (
    <div>
      <div>kind:30003</div>
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
                <div>ID:{id}</div>

                <For each={props.bookmarks.kind30003[id]}>
                  {(nosevent, index) => (
                    <div>
                      <EventItem
                        nosEvent={nosevent}
                        handleClickEvent={props.handleClickEvent}
                        handleClickPublish={props.handleClickPublish}
                        value={index().toString()}
                      />
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
