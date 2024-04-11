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
  Typography,
} from "@suid/material";
import EventItem from "./EventItem";

export default function Kind30001(props: BkmProps) {
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
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <For each={Object.keys(props.bookmarks.kind30001)}>
          {(id, i) => (
            <Box
              sx={{
                width: "95%",

                my: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                "& > *": {
                  m: 1,
                },

                border: 1,
                borderColor: (theme: Theme) => theme.palette.primary.main,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ placeSelf: "start", m: 2 }}
              >
                ID:{id}
              </Typography>

              <div>
                <For each={props.bookmarks.kind30001[id]}>
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
                          props.bookmarks.kind30001[id].length > index() + 1
                        }
                      >
                        <Divider />
                      </Show>
                    </div>
                  )}
                </For>
              </div>
            </Box>
          )}
        </For>
      </RadioGroup>
    </>
  );
}
