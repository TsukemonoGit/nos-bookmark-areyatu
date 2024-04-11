import { For } from "solid-js";
import { BookmarkEventList, Props } from "../libs/nostrFunctions";
import { Button } from "@suid/material";

export default function Kind30001(props: Props) {
  return (
    <div>
      kind:30001
      <For each={Object.keys(props.bookmarks.kind30001)}>
        {(id, i) => (
          <div>
            <div>{id}</div>
            <For each={props.bookmarks.kind30001[id]}>
              {(event, j) => (
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
        )}
      </For>
    </div>
  );
}
