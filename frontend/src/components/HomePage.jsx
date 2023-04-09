import React, { useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Room from "./Room";

const Home = () => {
  return (
    <Grid container spacing={3} alignItems="center" direction="column">
      <Grid item xs={12}>
        <Typography variant="h3" compact="h3">
          Spotify Party
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default function HomePage() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code);
      });
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={roomCode ? <Navigate to={`/room/${roomCode}`} /> : <Home />}
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}
