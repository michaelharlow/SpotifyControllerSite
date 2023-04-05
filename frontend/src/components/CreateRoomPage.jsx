import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

export default function CreateRoomPage() {
  let defaultVotes = 2;
  let navigate = useNavigate();

  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

  const handleVotesToSkipChange = (e) => {
    setVotesToSkip(parseInt(e.target.value));
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true" ? true : false);
  };

  const handleCreateRoomButtonClicked = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align={"center"}>
        <Typography component="h4" variant="h4">
          {"Create a Room"}
        </Typography>
      </Grid>
      <Grid item xs={12} align={"center"}>
        <FormControl component="fieldset">
          <FormHelperText>{"Guest Control of Playback State"}</FormHelperText>
          <RadioGroup
            row
            defaultValue={"true"}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align={"center"}>
        <FormControl>
          <TextField
            required={true}
            type={"number"}
            onChange={handleVotesToSkipChange}
            defaultValue={defaultVotes}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
          />
          <FormHelperText>{"Votes Required to Skip Song"}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align={"center"}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleCreateRoomButtonClicked}
        >
          Create a Room
        </Button>
      </Grid>
      <Grid item xs={12} align={"center"}>
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
