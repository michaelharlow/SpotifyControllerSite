import React from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter, Routes, Route, Link, Redirect } from "react-router-dom";
import Room from "./Room";

export default function HomePage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<p>this is the home page!!</p>} />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}
