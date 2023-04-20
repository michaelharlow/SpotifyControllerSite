import React from "react";
import {
  Grid,
  Button,
  Typography,
  Card,
  LinearProgress,
  IconButton,
} from "@mui/material";

import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

function MusicPlayer(props) {
  console.log(props);

  let songProgress = (props.time / props.duration) * 100;

  return (
    <Card>
      <Grid container alignItems="center" direction="column">
        <Grid item xs={4}>
          <img src={props.image_url} height="100%" width="100%" />
        </Grid>
        <Grid item xs={8}>
          <Typography component="h5" variant="h5">
            {props.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.artist}
          </Typography>
          <IconButton>
            <SkipNextIcon />
          </IconButton>
          <IconButton>
            <PlayArrowIcon />
          </IconButton>
          <IconButton>
            <PauseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
}

export default MusicPlayer;
