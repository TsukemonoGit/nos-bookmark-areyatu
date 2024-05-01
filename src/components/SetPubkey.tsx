import { Button, TextField, Input, Stack } from "@suid/material";
import { Accessor } from "solid-js";
import { BookmarkEventList, isNostrEvent } from "../libs/nostrFunctions";
import { EventPacket } from "rx-nostr";
import { SetStoreFunction } from "solid-js/store";
import { FileUpload, Search } from "@suid/icons-material";

interface SetPubkeyProps {
  pubkey: Accessor<string>; // 仮にstring型としていますが、実際の型に応じて変更してください
  onChange: (event: Event) => void; // onChangeの型はイベントを受け取る関数として指定します
  onSubmit: (event: Event) => void;
  getPubkey: (event: Event) => void;
  bkmEvents: BookmarkEventList;
  setBkmEvents: SetStoreFunction<BookmarkEventList>;
  setToastState: any;
  setToastOpen: any;
}

export default function SetPubkey({
  pubkey,
  onChange,
  onSubmit,
  getPubkey,
  bkmEvents,
  setBkmEvents,
  setToastState,
  setToastOpen,
}: SetPubkeyProps) {
  const handleLoadJson = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return;
        const contents = event.target?.result;
        //console.log("File contents:", contents);
        // ファイルの内容をstateなどに保存してコンポーネント内で表示するなどの処理を行うことができます
        if (!contents) {
          setToastState({
            message: "error",
            type: "error",
          });
          setToastOpen(true);
          return;
        }
        const contentsObj = JSON.parse(contents as string);
        console.log("File contentsObj:", contentsObj);

        if (!isNostrEvent(contentsObj)) {
          console.log("contentsObj is not a NostrEvent");
          setToastState({
            message: "not a NostrEvent",
            type: "error",
          });
          setToastOpen(true);
          return;
        }
        if (
          contentsObj.kind !== 10003 &&
          contentsObj.kind !== 30003 &&
          contentsObj.kind !== 30001
        ) {
          setToastState({
            message: "not a BookmarksEvent",
            type: "error",
          });
          setToastOpen(true);
          return;
        }

        const packet: EventPacket = {
          from: "Local",
          event: contentsObj,
          subId: "",
          rootPubkey: "",
          type: "EVENT",
          message: ["EVENT", "", contentsObj],
        };

        if (
          packet.event.kind === 10003 &&
          !bkmEvents.kind10003?.find(
            (item) => item.event.id === packet.event.id
          )
        ) {
          setBkmEvents((prevBkmEvents) => ({
            ...prevBkmEvents,
            kind10003: [...prevBkmEvents.kind10003, packet],
          }));
          setToastState({
            message: "set bookmark kind:10003",
            type: "info",
          });
          setToastOpen(true);
        } else if (packet.event.kind === 30003) {
          const id = packet.event.tags.find((item) => item[0] == "d");
          if (id) {
            console.log(id);
            if (!bkmEvents.kind30003[id[1]]) {
              //bkmEvents.kind30003[id[1]] = [];
              setBkmEvents((prevBkmEvents) => ({
                ...prevBkmEvents,
                kind30003: {
                  ...prevBkmEvents.kind30003,
                  [id[1]]: [], // id[1]に対応するプロパティを空の配列に設定する
                },
              }));
            }
            if (
              !bkmEvents.kind30003[id[1]].find(
                (item) => item.event.id === packet.event.id
              )
            ) {
              setBkmEvents((prevBkmEvents) => ({
                ...prevBkmEvents,
                kind30003: {
                  ...prevBkmEvents.kind30003,
                  [id[1]]: [
                    ...(prevBkmEvents.kind30003[id[1]] || []), // 既存の配列が存在しない場合に備えてデフォルト値を設定
                    packet,
                  ],
                },
              }));
              setToastState({
                message: "set bookmark kind:30003",
                type: "info",
              });
              setToastOpen(true);
            }
          }
        } else if (packet.event.kind === 30001) {
          const id = packet.event.tags.find((item) => item[0] == "d");
          if (id) {
            if (!bkmEvents.kind30001[id[1]]) {
              setBkmEvents((prevBkmEvents) => ({
                ...prevBkmEvents,
                kind30001: {
                  ...prevBkmEvents.kind30001,
                  [id[1]]: [], // id[1]に対応するプロパティを空の配列に設定する
                },
              }));
            }
            if (
              !bkmEvents.kind30001[id[1]].find(
                (item) => item.event.id === packet.event.id
              )
            ) {
              setBkmEvents((prevBkmEvents) => ({
                ...prevBkmEvents,
                kind30001: {
                  ...prevBkmEvents.kind30001,
                  [id[1]]: [
                    ...(prevBkmEvents.kind30001[id[1]] || []), // 既存の配列が存在しない場合に備えてデフォルト値を設定
                    packet,
                  ],
                },
              }));
              console.log(bkmEvents.kind30001[id[1]]);
              setToastState({
                message: "set bookmark kind:30001",
                type: "info",
              });
              setToastOpen(true);
            }
          }
        }
      };
      reader.readAsText(file);
    }
  };
  return (
    <>
      {/* <Grid container spacing={2} justifyContent="center" alignItems="end">
        <Grid item> */}
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={getPubkey}
          sx={{ py: 0.5 }}
          size="large"
        >
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
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 2 }}>
        <Button variant="contained" onClick={onSubmit} sx={{ py: 2 }}>
          <Search />
          Search Relays
        </Button>

        <label for="contained-button-file">
          <Input
            accept=".json"
            id="contained-button-file"
            multiple
            type="file"
            style={{ display: "none" }}
            onChange={handleLoadJson}
          />
          <Button variant="contained" component="span" sx={{ py: 2 }}>
            <FileUpload /> Upload Json File
          </Button>
        </label>
      </Stack>
    </>
  );
}
