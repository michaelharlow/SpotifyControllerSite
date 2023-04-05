import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme, Box } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: red,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems="center"
        minHeight="100vh"
      >
        <HomePage />
      </Box>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
