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
  return (
    <footer>
      <Container
        maxWidth="lg"
        sx={{
          mt: 8,
          mb: 2,
          bgcolor: (theme: Theme) => theme.palette.grey[100],
        }}
      >
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
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
        </Box>
      </Container>
    </footer>
  );
}
