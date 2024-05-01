import { Box, Theme, FormControl, Typography } from "@suid/material";
import { JSXElement } from "solid-js";
interface BkmBoxProps {
  kind: string;
  children: JSXElement;
}
export default function BkmBox({ kind, children }: BkmBoxProps) {
  return (
    <>
      <Typography variant="h5" component="div" sx={{ mt: 2 }}>
        kind:{kind}
      </Typography>

      <Box
        sx={{
          margin: 2,
          width: "600px",
          maxWidth: "100%",
          p: 1,
          border: 1,
          borderColor: (theme: Theme) => theme.palette.primary.main,
        }}
      >
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& > *": {
              m: 1,
            },
          }}
        >
          {children}
        </FormControl>
      </Box>
    </>
  );
}
