import { createSignal } from "solid-js";
import FormComponent from "./FormComponent";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@suid/material";
import { unwrap } from "solid-js/store";
import { sendMessage } from "../libs/nostrFunctions";
import { sendpub } from "../libs/pubkey";

export default function Form({
  setToastState,
  setToastOpen,
  nowProgress,
  setNowProgress,
}: any) {
  const [open, setOpen] = createSignal(false);
  const [name, setName] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [error, setError] = createSignal(false);

  const MAX_MESSAGE_LENGTH = 400; // メッセージの最大長

  const handleClickOpen = () => {
    if (message().trim() === "") {
      setError(true);
      return;
    }
    if (name().trim() === "") {
      setName("anonymous");
    }
    setOpen(true);
  };

  const handleClose = async (bool: boolean) => {
    if (bool && !nowProgress()) {
      if (message().trim() !== "") {
        // ここでメッセージを送信する処理を行う

        setNowProgress(true);
        try {
          if (sendpub) {
            const result = await sendMessage(unwrap(message()), sendpub);
            const hasSuccess = Array.from(result.values()).some(
              (isSuccess) => isSuccess
            );

            setToastState(
              hasSuccess
                ? { type: "success", message: "Thank you for reaching out!" }
                : {
                    type: "error",
                    message:
                      "Failed to send your message. Please try again later.",
                  }
            );
            setToastOpen(true);
          } else {
            throw error;
          }
        } catch (error) {
          setToastState({
            type: "error",
            message: "Failed to send your message. Please try again later.",
          });
          setToastOpen(true);
        }
      }
    }
    setNowProgress(false);
    setOpen(false);
  };

  // メッセージ欄に入力があった場合にエラー状態を解消する関数
  const handleInputChange = (e: any) => {
    if (e.target.value.trim() !== "") {
      setError(false);
    }
    setMessage(e.target.value);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
        <Grid
          container
          spacing={2}
          sx={{ height: "100%" }}
          flexDirection="column"
          alignItems="center"
        >
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {"Send a message to the author"}
          </Typography>
          <Grid
            item
            width={400}
            maxWidth={"90%"}
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              placeContent: "center",
              overflowY: "auto",
              fontSize: "small",
            }}
          >
            <TextField
              fullWidth
              type="text"
              placeholder="name (not required)"
              value={name()}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid
            width={400}
            maxWidth={"90%"}
            item
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              height: "50%",
              overflowY: "auto",
              fontSize: "small",
            }}
          >
            <TextField
              fullWidth
              placeholder="message"
              value={message()}
              multiline
              rows={4}
              onChange={handleInputChange} // 入力変更時に呼び出す関数を変更
              error={error()}
              helperText={
                error()
                  ? `Message is required and must be less than ${MAX_MESSAGE_LENGTH} characters`
                  : ""
              }
              inputProps={{ maxLength: MAX_MESSAGE_LENGTH }} // 最大文字数を設定
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              type="submit"
              onClick={handleClickOpen}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={open()}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Send message?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  name
                </Typography>
                <Typography variant="body1" component="div" sx={{ mb: 1.5 }}>
                  {name()}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  message
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    maxHeight: "6rem",
                    overflowY: "auto",
                  }}
                >
                  {message()}
                </Typography>
              </CardContent>
            </Card>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Disagree</Button>
          <Button onClick={() => handleClose(true)}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
