import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Divider,
  Link,
  List,
  ListItem,
  Theme,
  useTheme,
} from "@suid/material";

export function Footer() {
  const theme = useTheme();
  // ダークモードの場合、別の色を使用する
  const backgroundColor =
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[200];

  return (
    <footer>
      <Container
        maxWidth="lg"
        sx={{
          mt: 8,
          mb: 2,
          bgcolor: backgroundColor,
        }}
      >
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            // alignItems: "center",
            "& > *": {
              m: 1,
            },
          }}
        >
          <Link
            href={"https://github.com/TsukemonoGit/nos-bookmark-areyatu"}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            underline="none"
            sx={{
              p: 2,
            }}
          >
            source
          </Link>
          <Link
            href={"https://github.com/nostr-protocol/nips/blob/master/51.md"}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            underline="none"
            sx={{
              p: 2,
            }}
          >
            NIP-51
          </Link>
        </Box>
      </Container>
    </footer>
  );
}
