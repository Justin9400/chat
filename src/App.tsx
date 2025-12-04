import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import ThumbDownOffAltRoundedIcon from "@mui/icons-material/ThumbDownOffAltRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";

const sampleMessages = [
  {
    id: "1",
    role: "user" as const,
    text: "Hello",
    time: "Just now",
  },
  {
    id: "2",
    role: "ai" as const,
    text: "Hey! What's up? 😊",
    time: "Just now",
  },
  {
    id: "3",
    role: "user" as const,
    text: "Share a fun fact",
    time: "Just now",
  },
  {
    id: "4",
    role: "ai" as const,
    text: "Did you know octopuses have three hearts and blue blood? They also taste things with their arms!",
    time: "Just now",
  },
];

const useTheme = () =>
  useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#1565d8" },
          secondary: { main: "#0fb281" },
          background: {
            default: "#f6f7fb",
            paper: "#ffffff",
          },
        },
        shape: { borderRadius: 18 },
        typography: {
          fontFamily: '"Inter", "Roboto", system-ui, -apple-system, sans-serif',
          h4: { fontWeight: 800, letterSpacing: -0.4 },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
              },
            },
          },
          MuiButtonBase: {
            defaultProps: {
              disableRipple: true,
            },
          },
        },
      }),
    []
  );

function App() {
  const theme = useTheme();
  const [input, setInput] = useState("");
  const [isThinking] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "radial-gradient(circle at 10% 20%, #e3edff 0, transparent 25%), radial-gradient(circle at 90% 10%, #e0f7ff 0, transparent 25%), #f6f7fb",
        }}
      >
        <Container maxWidth="md" sx={{ py: 6, display: "flex", flexDirection: "column", gap: 3 }}>
          <Stack alignItems="center" spacing={1} textAlign="center">
            <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 28, fontWeight: 800 }}>
              G
            </Avatar>
            <Typography variant="h4" component="h1">
              Grok
            </Typography>
            <Typography color="text.secondary">Ask anything. Stay curious.</Typography>
          </Stack>

          <Paper sx={{ p: 2.5 }}>
            <Stack spacing={2} alignItems="center">
              <TextField
                fullWidth
                placeholder="What do you want to know?"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label="Auto" size="small" sx={{ bgcolor: "#f0f4ff" }} />
                        <IconButton aria-label="voice input" size="small">
                          <MicNoneRoundedIcon />
                        </IconButton>
                      </Stack>
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                <Chip label="DeepSearch" variant="outlined" />
                <Chip label="Pick Persona" variant="outlined" />
                <Chip label="Voice" variant="outlined" />
              </Stack>
            </Stack>
          </Paper>

          <Paper sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
              <Typography fontWeight={700}>Conversation</Typography>
              <Divider flexItem orientation="vertical" />
              <Typography variant="body2">Live</Typography>
            </Stack>

            <Stack spacing={1.5}>
              {sampleMessages.map((message) => (
                <Stack
                  key={message.id}
                  direction="row"
                  spacing={1.25}
                  justifyContent={message.role === "user" ? "flex-start" : "flex-start"}
                  alignItems="flex-start"
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: message.role === "user" ? "grey.200" : "primary.main",
                      color: message.role === "user" ? "text.primary" : "primary.contrastText",
                    }}
                  >
                    {message.role === "user" ? "You" : "G"}
                  </Avatar>
                  <Paper
                    variant="outlined"
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: message.role === "ai" ? "#f7f9ff" : "#fff",
                      flex: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5} color="text.secondary">
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {message.role === "ai" ? "Grok" : "You"}
                      </Typography>
                      <Typography variant="caption">· {message.time}</Typography>
                    </Stack>
                    <Typography variant="body1" color="text.primary">
                      {message.text}
                    </Typography>
                    {message.role === "ai" && (
                      <Stack direction="row" spacing={1} mt={1.5} color="text.secondary">
                        <IconButton size="small" aria-label="like">
                          <ThumbUpOffAltRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" aria-label="dislike">
                          <ThumbDownOffAltRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" aria-label="bookmark">
                          <BookmarkBorderRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" aria-label="more">
                          <MoreHorizRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    )}
                  </Paper>
                </Stack>
              ))}
            </Stack>

            {isThinking && <LinearProgress color="primary" sx={{ mt: 1 }} />}
          </Paper>

          <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                Message Grok to start a conversation
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="How can Grok help?"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label="Auto" size="small" />
                        <IconButton color="primary" aria-label="send">
                          <SendRoundedIcon />
                        </IconButton>
                      </Stack>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
