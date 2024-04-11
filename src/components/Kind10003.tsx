import { For } from "solid-js";
import { BookmarkEventList, Props } from "../libs/nostrFunctions";
import { Button } from "@suid/material";

export default function Kind10003(props: Props) {
  return (
    <div>
      kind:10003
      <For each={props.bookmarks.kind10003}>
        {(event, index) => (
          <div>
            <div>
              event.created_at:
              {new Date(event.created_at * 1000).toLocaleString()},
              event.tags.length:
              {event.tags.length}, event.content.length:
              {event.content.length}
            </div>
            <Button>もっとみる</Button>
          </div>
        )}
      </For>
    </div>
  );
}
