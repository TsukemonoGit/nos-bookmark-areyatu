import { NostrEvent } from "@nostr-dev-kit/ndk";
import Button from "@suid/material/Button";

export default function EventItem(props: {
  nosEvent: NostrEvent;
  handleClickEvent: (arg0: NostrEvent) => void;
  value: string;
  handleClickPublish: (arg0: NostrEvent) => void;
}) {
  const { nosEvent, handleClickEvent, handleClickPublish } = props;

  return (
    <div>
      <Button onClick={() => handleClickPublish(nosEvent)}>書き込む</Button>
      <div>
        tags.length: {nosEvent?.tags?.length}, content.length:{" "}
        {nosEvent?.content?.length}
      </div>
      <Button onClick={() => handleClickEvent(nosEvent)}>もっとみる</Button>
    </div>
  );
}
