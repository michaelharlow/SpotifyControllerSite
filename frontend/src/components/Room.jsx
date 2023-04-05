import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function Room() {
  let defaultVotes = 2;
  let { roomCode } = useParams();

  const [guestCanPause, setGuestCanPause] = useState("");
  const [votesToSkip, setVotesToSkip] = useState("");
  const [isHost, setIsHost] = useState("");

  useEffect(() => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((Response) => Response.json())
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      });
  }, []);

  return (
    <div>
      <h1>{roomCode}</h1>
      <p>Votes: {votesToSkip}</p>
      <p>Guest Can Pause: {guestCanPause.toString()}</p>
      <p>Is host: {isHost.toString()}</p>
    </div>
  );
}
