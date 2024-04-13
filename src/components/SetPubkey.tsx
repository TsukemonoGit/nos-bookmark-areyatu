import { Grid, Button, TextField } from "@suid/material";
import { Accessor } from "solid-js";

interface SetPubkeyProps {
  pubkey: Accessor<string>; // 仮にstring型としていますが、実際の型に応じて変更してください
  onChange: (event: Event) => void; // onChangeの型はイベントを受け取る関数として指定します
  onSubmit: (event: Event) => void;
  getPubkey: (event: Event) => void;
}

export default function SetPubkey({
  pubkey,
  onChange,
  onSubmit,
  getPubkey,
}: SetPubkeyProps) {
  return (
    <>
      {/* <Grid container spacing={2} justifyContent="center" alignItems="end">
        <Grid item> */}
      <Button variant="contained" onClick={getPubkey} size="large">
        get Pubkey
      </Button>
      {/* </Grid>
        <Grid item> */}
      <TextField
        id="pubkey"
        label="npub or nsec"
        variant="outlined"
        fullWidth
        value={pubkey()}
        onChange={onChange}
        sx={{ mt: 2 }}
      />
      {/* </Grid>
      </Grid> */}
      <Button variant="contained" onClick={onSubmit} sx={{ mt: 2 }}>
        Get Bookmarks
      </Button>
    </>
  );
}
