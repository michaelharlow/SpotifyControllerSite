import React, { useEffect, useMemo, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

export default function Room(props) {
  let defaultVotes = 2;
  let navigate = useNavigate();
  let { roomCode } = useParams();

  const [guestCanPause, setGuestCanPause] = useState("");
  const [votesToSkip, setVotesToSkip] = useState("");
  const [isHost, setIsHost] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          props.exitCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      });
  }, []);

  const onLeaveButtonPress = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.exitCallback();
      navigate("/");
    });
  };

  const SettingsButton = () => {
    return (
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const Settings = () => {
    return (
      <Grid container spacing={1} alignItems="center" direction="column">
        <Grid item xs={12}>
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallBack={""}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowSettings(false)}
          >
            Close Settings
          </Button>
        </Grid>
      </Grid>
    );
  };

  if (showSettings) {
    return <Settings />;
  }
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
      {isHost && <SettingsButton />}
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
