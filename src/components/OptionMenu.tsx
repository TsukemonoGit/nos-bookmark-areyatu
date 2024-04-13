import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  Stack,
  useTheme,
} from "@suid/material";
import { Accessor } from "solid-js";
interface Props {
  optionHandleChange: any;
  optionValue: Accessor<number>;
}
export default function OptionMenu(props: Props) {
  const { optionHandleChange, optionValue } = props;

  return (
    <Box
      mx={2}
      my={4}
      p={2}
      // border={4}
      //borderColor={useTheme().palette.divider}
      bgcolor={useTheme().palette.divider}
      sx={{
        borderRadius: "10px",
      }}
    >
      <FormControl
        sx={{
          borderRadius: "10px",
          wordBreak: "break-all",
          flexWrap: "wrap",
        }}
      >
        <FormLabel id="demo-radio-buttons-group-label">Select Option</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          onChange={(e) => optionHandleChange(e)}
          value={optionValue()}
        >
          <Stack
            flex={"inline-flex"}
            sx={{ flexWrap: "wrap", mb: 2 }}
            flexDirection="row"
            whiteSpace="pre-line"
          >
            <FormControlLabel
              value={0}
              control={<Radio />}
              label="ひかえめに探す (30 relay くらい) "
            ></FormControlLabel>
            <Link
              href={
                "https://github.com/TsukemonoGit/nos-bookmark-areyatu/blob/main/src/libs/relays.ts#L17-L50"
              }
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              sx={{ alignSelf: "center", ml: 4 }}
            >
              extensionRelays
            </Link>
          </Stack>

          <Stack flexDirection="row" sx={{ flexWrap: "wrap", mb: 2 }}>
            <FormControlLabel
              value={1}
              control={<Radio />}
              label="そこそこに探す (60 relay くらい) "
              sx={{ flex: "inline-flex" }}
            />
            <Stack sx={{ alignSelf: "center", ml: 4, display: "flex-inline" }}>
              +
              <Link
                href={"https://api.nostr.watch/v1/online"}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ ml: 1 }}
              >
                https://api.nostr.watch/v1/online
              </Link>
              の一部
            </Stack>
          </Stack>
          <Stack flexDirection="row" sx={{ flexWrap: "wrap", mb: 2 }}>
            <FormControlLabel
              value={2}
              control={<Radio />}
              label="めっちゃ探す (200 relay くらい) "
            />
            <Stack sx={{ alignSelf: "center", display: "flex-inline", ml: 4 }}>
              +
              <Link
                href={"https://api.nostr.watch/v1/online"}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ alignSelf: "center", ml: 1 }}
              >
                https://api.nostr.watch/v1/online
              </Link>
            </Stack>
          </Stack>
          <Stack
            flexDirection="row"
            sx={{ flexWrap: "wrap" }}
            justifyItems="center"
          >
            <FormControlLabel
              value={3}
              control={<Radio />}
              label="あほほど探す"
            />
            <Stack sx={{ alignSelf: "center", display: "flex-inline", ml: 4 }}>
              +
              <Link
                href={"https://api.nostr.watch/v1/online"}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ alignSelf: "center", ml: 1 }}
              >
                https://api.nostr.watch/v1/online
              </Link>
              全部
            </Stack>
          </Stack>
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
