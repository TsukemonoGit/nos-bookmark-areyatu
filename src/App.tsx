import {
  Box,
  ThemeProvider,
  createTheme,
  styled,
  useMediaQuery,
  useTheme,
} from "@suid/material";
import { Content } from "./components/Content";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { createEffect, createMemo } from "solid-js";
import Head from "./components/Head";

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

  // createEffect(() => {
  //   document.body.style.setProperty(
  //     "background-color",
  //     useTheme().palette.text.secondary
  //   );
  // });
  console.log(prefersDarkMode());

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
          <Content />
          <Footer />
        </Box>
      </ThemeProvider>
    </>
  );
}
