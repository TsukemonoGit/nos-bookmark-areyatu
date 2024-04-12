/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { init as initNostrLogin } from "nostr-login";
initNostrLogin({
  /*options*/
});
render(() => <App />, document.getElementById("root")!);
