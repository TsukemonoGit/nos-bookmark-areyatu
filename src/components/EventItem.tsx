import { NostrEvent } from "@nostr-dev-kit/ndk";
import { Grid } from "@suid/material";
import Button from "@suid/material/Button";

export default function EventItem(props: {
  nosEvent: NostrEvent;
  handleClickEvent: (arg0: NostrEvent) => void;
  value: string;
  handleClickPublish: (arg0: NostrEvent) => void;
}) {
  const { nosEvent, handleClickEvent, handleClickPublish } = props;

  return (
    <Grid container spacing={1} sx={{ my: 0.1 }}>
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleClickPublish(nosEvent)}
        >
          Publish
        </Button>
      </Grid>
      <Grid item>
        {new Date(nosEvent.created_at * 1000).toLocaleString()}

        <Grid item>
          tags.length: {nosEvent?.tags?.length}, content.length:
          {nosEvent?.content?.length}
        </Grid>
        <Grid item>
          <Button
            sx={{
              placeContent: "end",

              width: "100%",
            }}
            onClick={() => handleClickEvent(nosEvent)}
          >
            もっとみる
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
