import { Container, Typography } from "@suid/material";

export function Header() {
  return (
    <header>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h4">Bookmark Data Recovery Tool</Typography>
        {/* <Typography variant="body2">Search from Various Relays and Retrieve and Save Nostr Bookmarks. </Typography> */}
      </Container>
    </header>
  );
}
