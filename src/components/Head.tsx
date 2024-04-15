import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";

export default function Head() {
  return (
    <MetaProvider>
      <div class="Home">
        <Title>Bookmark Recovery Tool</Title>
        <Link rel="icon" href="./images/favicon.svg" />
        <Meta property="og:type" content="website" />
        <Meta
          property="og:url"
          content="https://nostr-bookmark-recovery-tool.vercel.app/"
        />
        <Meta property="og:title" content="Bookmark Recovery Tool" />
        <Meta
          property="og:description"
          content="A nostr tool that searches through multiple relays for lost bookmarks and rewrite the data from before they were lost."
        />
        <Meta
          property="og:image"
          content={`${window.location.origin}/images/favicon.svg`}
        />
      </div>
    </MetaProvider>
  );
}
