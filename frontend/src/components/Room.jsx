import React, { useEffect, useMemo, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
  let navigate = useNavigate();
  let { roomCode } = useParams();

  const [guestCanPause, setGuestCanPause] = useState("");
  const [votesToSkip, setVotesToSkip] = useState("");
  const [isHost, setIsHost] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentSong();
    }, 1000);

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

        if (isHost) {
          authenticateSpotify();
        }
      });

    //Cleanup the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  });

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.href = data.url;
            });
        }
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
        console.log(data);
      });
  };

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
      <MusicPlayer {...song} />
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
