import {
  Modal,
  Box,
  Grid,
  useTheme,
  Button,
  Stack,
  Typography,
} from "@suid/material";

export default function PublishModal(props: {
  modalOpen: () => boolean;
  handleModalClose: any;
  nosEvent: () => any;
}) {
  const theme = useTheme();

  const handleClickCancel = () => {
    props.handleModalClose();
  };

  const handleClickPublish = () => {
    props.handleModalClose("publish");
  };
  return (
    <Modal
      open={props.modalOpen()}
      onClose={() => props.handleModalClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
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
            <Typography variant="h4">Publish at the current time?</Typography>
          </Grid>
          <Grid
            item
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              height: "50%",
              py: 1,
              overflowY: "auto",
              fontSize: "small",
              border: 1,
              width: "100%",
              m: 2,
            }}
          >
            {JSON.stringify(props.nosEvent(), null, 2)}
          </Grid>
          <Grid
            item
            sx={{
              width: "100%",
            }}
          >
            <Stack
              spacing={2}
              direction="row"
              sx={{
                placeContent: "end",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClickCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickPublish}
              >
                Publish
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
