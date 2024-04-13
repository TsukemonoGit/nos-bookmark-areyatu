import { Card, Container, Typography } from "@suid/material";

export function Header() {
  return (
    <header>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h4">Nostr Bookmark Recovery Tool</Typography>
        {/* <Card sx={{}}>
          <Typography variant="body2">
            <p>pubkeyを元にユーザーのリレーリストを取得。</p>
            <p>それ＋適当にリレーを追加して、ブックマークを検索</p>
          </Typography>{" "}
        </Card> */}
      </Container>
    </header>
  );
}
