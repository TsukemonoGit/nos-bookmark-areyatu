import { Box, Fade, Alert } from "@suid/material";
import { Accessor, createEffect, createSignal } from "solid-js";

interface Props {
  timeout: number;
  toastOpen: Accessor<boolean | undefined>;
  handleToastClose: () => void; // ハンドラー関数の型を修正
  toastState: Accessor<{
    message: string;
    type: "success" | "info" | "warning" | "error";
  }>;
  sx?: any;
}

export default function Toast({
  timeout = 5,
  toastOpen,
  handleToastClose,
  toastState,
  sx,
}: Props) {
  const [open, setOpen] = createSignal<boolean>(false); // 初期値をfalseに設定

  createEffect(() => {
    console.log(toastState);
    setOpen(toastOpen() || false);
  });

  createEffect(() => {
    let timer: NodeJS.Timeout;
    if (open()) {
      timer = setTimeout(() => {
        handleToastClose();
      }, timeout * 1000);
    }
    return () => clearTimeout(timer);
  });

  return (
    <Fade in={open()}>
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          width: "90%",
          ml: "auto",
          display: "flex",
          justifyContent: "center",
          ...sx,

          wordBreak: "break-all",
          whiteSpace: "pre-line",
        }}
      >
        <Alert severity={toastState().type} variant="filled">
          {toastState().message}
        </Alert>
      </Box>
    </Fade>
  );
}
