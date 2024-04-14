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
  alpha,
  useTheme,
} from "@suid/material";

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
              py: 2,
              px: 1,
              fontWeight: "bold",
            }}
          >
            SOURCE
          </Link>
          <Link
            href={"https://github.com/nostr-protocol/nips/blob/master/51.md"}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            underline="none"
            sx={{
              py: 2,
              px: 1,
              fontWeight: "bold",
            }}
          >
            NIP-51
          </Link>
        </Box>
      </Container>
    </footer>
  );
}
