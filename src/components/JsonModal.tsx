import { Modal, Box, Grid, useTheme } from "@suid/material";

export default function JsonModal(props: {
  modalOpen: () => boolean;
  handleModalClose:
    | ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    | undefined;
  nosEvent: () => any;
}) {
  const theme = useTheme();
  return (
    <Modal
      open={props.modalOpen()}
      onClose={props.handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw", // 画面の幅の90%を使う
          height: "70vh", // 画面の高さの90%を使う
          bgcolor: theme.palette.background.paper,
          border: "2px solid #000",
          boxShadow: "24px",
          p: 4,
          maxWidth: "80vw",
          maxHeight: "70vh",
        }}
      >
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item>
            <b>EventJson</b>
          </Grid>
          <Grid
            item
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",

              height: "100%",
              py: "1rem",
              overflowY: "auto",
            }}
          >
            {JSON.stringify(props.nosEvent(), null, 2)}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
