import React, { useEffect, useMemo, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function Room() {
  let defaultVotes = 2;
  let navigate = useNavigate();
  let { roomCode } = useParams();

  const [guestCanPause, setGuestCanPause] = useState("");
  const [votesToSkip, setVotesToSkip] = useState("");
  const [isHost, setIsHost] = useState("");

  useEffect(() => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          navigate("/");
          //throws error to prevent bad data read
          throw new Error("Bad room code");
        }
        response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onLeaveButtonPress = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    fetch("/api/leave-room", requestOptions).then((_response) => {
      navigate("/");
    });
  };

  return (
    <Grid container spacing={1} alignItems="center" direction="column">
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="h6">
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="h6">
          Is host: {isHost.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onLeaveButtonPress}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}
