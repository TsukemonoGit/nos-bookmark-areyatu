import {
  Modal,
  Box,
  Grid,
  useTheme,
  Button,
  Link,
  Typography,
} from "@suid/material";
import { EventPacket } from "rx-nostr";
import { neventEncode } from "../../libs/nip19";

export default function JsonModal(props: {
  modalOpen: () => boolean;
  handleModalClose:
    | ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    | undefined;
  nosEvent: () => EventPacket | null;
}) {
  const url = (): string => {
    const eventId = props.nosEvent()?.event.id;
    const seenRelay = props.nosEvent()?.from;
    const nevent = neventEncode({
      id: eventId ?? "",
      relays: [seenRelay ?? ""],
      author: props.nosEvent()?.event.pubkey,
      kind: props.nosEvent()?.event.kind,
    });
    return "https://nostviewstr.vercel.app/" + nevent;
  };
  console.log(url());

  const theme = useTheme();
  return (
    <Modal
      open={props.modalOpen()}
      onClose={props.handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ color: theme.palette.text.primary }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          height: "70vh",
          bgcolor: theme.palette.background.paper,
          border: "2px solid #000",
          boxShadow: "24px",
          p: 4,
          maxWidth: "80vw",
          maxHeight: "70vh",
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item>
            <Typography
              variant="h4"
              component="div"
              sx={{ placeSelf: "start" }}
            >
              EventJson
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",

              height: "60%",
              py: 1,
              overflowY: "auto",
              border: 1,
            }}
          >
            {JSON.stringify(props.nosEvent()?.event, null, 2)}
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              width: "100%",

              justifyContent: "end",
            }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div>seen on: {props.nosEvent()?.from}</div>

              <Link
                href={url()}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ textAlign: "end" }}
              >
                Open in NostViewstr
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
