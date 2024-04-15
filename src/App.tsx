import {
  Box,
  CircularProgress,
  ThemeProvider,
  createTheme,
  styled,
  useMediaQuery,
  useTheme,
} from "@suid/material";
import { Content } from "./components/Content";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Show, createEffect, createMemo, createSignal } from "solid-js";
import Head from "./components/Head";
import Toast from "./components/Modals/Toast";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode() ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const [toastOpen, setToastOpen] = createSignal<boolean>();

  const [toastState, setToastState] = createSignal<{
    message: string;
    type: "success" | "info" | "warning" | "error";
  }>({
    message: "",
    type: "info",
  });

  const [nowProgress, setNowProgress] = createSignal(false);
  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <>
      <Head />
      <ThemeProvider theme={theme()}>
        <Box
          sx={{
            bgcolor: useTheme().palette.background.paper,
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            overflowY: "auto",
            color: useTheme().palette.text.primary,
          }}
        >
          <Header />
          <Content
            setToastOpen={setToastOpen}
            setToastState={setToastState}
            setNowProgress={setNowProgress}
            nowProgress={nowProgress}
          />
          <Footer
            setToastOpen={setToastOpen}
            setToastState={setToastState}
            setNowProgress={setNowProgress}
            nowProgress={nowProgress}
          />
          <Toast
            timeout={5}
            toastOpen={toastOpen}
            handleToastClose={handleToastClose}
            toastState={toastState}
          />
          <Show when={nowProgress()}>
            <CircularProgress
              color="secondary"
              sx={{ position: "fixed", bottom: 10, right: 10 }}
              size={100}
            />
          </Show>
        </Box>
      </ThemeProvider>
    </>
  );
}
