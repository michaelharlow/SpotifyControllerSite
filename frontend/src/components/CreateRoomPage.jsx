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
  Collapse,
  Alert,
} from "@mui/material";

function CreateRoomPage(props) {
  let navigate = useNavigate();

  const title = props.update ? "Update Room" : "Create a Room";
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
  const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip);
  const [error, setError] = useState("");

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

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setError("Room updated successfully!");
      } else {
        setError("Error updating room...");
      }
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={error != ""}>
          <Alert severity="success" sx={{ width: "215px" }}>
            {error}
          </Alert>
        </Collapse>
      </Grid>
      <Grid item xs={12} align={"center"}>
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align={"center"}>
        <FormControl component="fieldset">
          <FormHelperText>{"Guest Control of Playback State"}</FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause}
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
            defaultValue={votesToSkip}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
          />
          <FormHelperText>{"Votes Required to Skip Song"}</FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? (
        <Grid item xs={12} align={"center"}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateButtonPressed}
          >
            Update Room
          </Button>
        </Grid>
      ) : (
        <>
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
            <Button
              color="secondary"
              variant="contained"
              to="/"
              component={Link}
            >
              Back
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
}

CreateRoomPage.defaultProps = {
  votesToSkip: 2,
  guestCanPause: true,
  update: false,
  roomCode: null,
};

export default CreateRoomPage;
