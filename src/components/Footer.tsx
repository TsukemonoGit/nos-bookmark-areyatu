import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Theme,
  alpha,
  useTheme,
} from "@suid/material";
import {
  githubIcon,
  lightningIcon,
  lightningIcon2,
  nostrIcon,
} from "../libs/icons";

export function Footer() {
  const theme = useTheme();

  return (
    <footer>
      <Container
        maxWidth="lg"
        sx={{
          mt: 8,
          bgcolor: `${alpha(useTheme().palette.divider, 0.1)}`,
        }}
      >
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
          }}
        >
          <IconButton
            aria-label="ソースコードへのリンク"
            onClick={() => {
              window.open(
                "https://github.com/TsukemonoGit/nos-bookmark-areyatu",
                "_blank",
                "noreferrer"
              );
            }}
            sx={{}}
          >
            <Stack
              innerHTML={githubIcon}
              sx={{
                fill: useTheme().palette.text.primary,
                width: "24px",
              }}
            />
          </IconButton>
          <IconButton
            aria-label="nostterのmonoページへのリンク"
            onClick={() => {
              window.open(
                "https://nostter.app/mono@tsukemonogit.github.io",
                "_blank",
                "noreferrer"
              );
            }}
            sx={{}}
          >
            <Stack
              innerHTML={nostrIcon}
              sx={{
                width: "28px",
              }}
            />
          </IconButton>
          <IconButton
            id="nostr-zap-target"
            aria-label="Zapボタン"
            data-npub="npub1sjcvg64knxkrt6ev52rywzu9uzqakgy8ehhk8yezxmpewsthst6sw3jqcw"
            data-relays="wss://nostr.mutinywallet.com,wss://nos.lol,wss://nostr.wine,wss://relay.nostr.band"
            data-note-id="note160q4w6ar27qjpwrfxhnwv5ra3hpj552m230kau4vg5sf3d9das3q0hvglm"
          >
            <Stack
              innerHTML={lightningIcon2}
              sx={{
                fill: useTheme().palette.warning.light,
              }}
            />
          </IconButton>
          <IconButton
            aria-label="NIP-51へのリンク"
            onClick={() => {
              window.open(
                "https://github.com/nostr-protocol/nips/blob/master/51.md",
                "_blank",
                "noreferrer"
              );
            }}
            sx={{
              borderRadius: "10px",
              fontSize: "medium",
              py: 2,
              px: 1,
              fontWeight: "bold",
            }}
          >
            NIP-51
          </IconButton>
        </Box>
      </Container>
    </footer>
  );
}
