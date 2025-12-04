import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SendIcon from "@mui/icons-material/Send";
import FlashOnIcon from "@mui/icons-material/FlashOn";

const models = [
  { id: "nova-3", label: "Nova 3", description: "Balanced assistant for most tasks" },
  { id: "nova-3-mini", label: "Nova 3 Mini", description: "Fast lightweight chat" },
  { id: "analysis-pro", label: "Analysis Pro", description: "Analytical model for structured outputs" },
];

type Tone = "Balanced" | "Concise" | "Detailed" | "Playful";
type MessageRole = "user" | "ai";

type Message = {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
};

const toneLead: Record<Tone, string> = {
  Balanced: "Here you go with a balanced take:",
  Concise: "Quick answer:",
  Detailed: "Let me unpack that in detail:",
  Playful: "Fun spin coming up:",
};

const examplePrompts = [
  { title: "Brainstorm", text: "Give me three fresh product taglines for a wellness app." },
  { title: "Explain", text: "Explain how transformers work using a cooking analogy." },
  { title: "Summarize", text: "Summarize the key ideas from the latest AI safety research." },
  { title: "Plan", text: "Draft a 7-day learning plan to get comfortable with TypeScript." },
];

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const formatTime = (timestamp: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [tone, setTone] = useState<Tone>("Balanced");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [typingPause, setTypingPause] = useState(true);
  const [showExamples, setShowExamples] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [status, setStatus] = useState({ text: "Ready", accent: false });
  const [isSending, setIsSending] = useState(false);

  const chatLogRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<number>();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#71c6ff" : "#0b6ad8" },
          background: {
            default: mode === "dark" ? "#0b1523" : "#f5f7fb",
            paper: mode === "dark" ? "#111c2c" : "#ffffff",
          },
        },
        shape: { borderRadius: 16 },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", Arial, sans-serif',
          body1: { lineHeight: 1.6 },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                border: mode === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
              },
            },
          },
          MuiButton: {
            defaultProps: { disableElevation: true },
          },
        },
      }),
    [mode]
  );

  const selectedModelLabel = useMemo(
    () => models.find((model) => model.id === selectedModel)?.label ?? "Model",
    [selectedModel]
  );

  useEffect(() => {
    const log = chatLogRef.current;
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        window.clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  const addMessage = (role: MessageRole, text: string) => {
    const entry: Message = { id: createId(), role, text, timestamp: new Date() };
    setMessages((prev) => [...prev, entry]);
  };

  const composeResponse = (prompt: string) => {
    const modelLabel = models.find((model) => model.id === selectedModel)?.label ?? "Model";
    const closing = tone === "Playful" ? "Let me know if you want another quirky angle!" : "Happy to refine further.";

    return (
      `${toneLead[tone]} ${prompt}\n\n` +
      `${modelLabel} thinks the key points are:\n` +
      `• Understand intent clearly.\n` +
      `• Respond with the tone selected (${tone}).\n` +
      `• Provide a follow-up option for deeper exploration.\n\n${closing}`
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;

    setInput("");
    setShowExamples(false);
    addMessage("user", message);
    setStatus({ text: `Thinking with ${selectedModelLabel}`, accent: true });
    setIsSending(true);

    const respond = () => {
      const reply = composeResponse(message);
      addMessage("ai", reply);
      setStatus({ text: "Ready", accent: false });
      setIsSending(false);
    };

    if (typingPause) {
      const delay = Math.min(1400, 500 + message.length * 4);
      typingTimeout.current = window.setTimeout(respond, delay);
    } else {
      respond();
    }
  };

  const handleClear = () => {
    if (typingTimeout.current) {
      window.clearTimeout(typingTimeout.current);
    }
    setMessages([]);
    setShowExamples(true);
    setStatus({ text: "Ready", accent: false });
    setIsSending(false);
  };

  const renderMeta = (role: MessageRole, timestamp: Date) => {
    if (!showTimestamps) return null;
    return `${role === "user" ? "You" : "Assistant"} · ${formatTime(timestamp)}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              mode === "dark"
                ? "radial-gradient(circle at 15% 20%, rgba(113,198,255,0.15), transparent 35%), radial-gradient(circle at 85% 15%, rgba(255,140,204,0.12), transparent 30%)"
                : "radial-gradient(circle at 20% 20%, rgba(11,106,216,0.12), transparent 35%), radial-gradient(circle at 80% 10%, rgba(255,140,204,0.12), transparent 30%)",
            pointerEvents: "none",
          },
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          color="transparent"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backdropFilter: "blur(12px)",
            backgroundColor: (theme) => `${theme.palette.background.default}aa`,
          }}
        >
          <Toolbar sx={{ gap: 2, justifyContent: "space-between" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", color: "background.paper", width: 40, height: 40 }}>
                <FlashOnIcon />
              </Avatar>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                  Hyper Chat
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Modern AI Studio
                </Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
              <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 260 } }}>
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  label="Model"
                  value={selectedModel}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedModel(value);
                    const modelText = models.find((model) => model.id === value);
                    setStatus({
                      text: modelText
                        ? `Model set to ${modelText.label} — ${modelText.description}`
                        : "Model updated",
                      accent: true,
                    });
                  }}
                >
                  {models.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      <Stack spacing={0.5}>
                        <Typography fontWeight={600}>{model.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {model.description}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <IconButton
                color="inherit"
                onClick={() => setMode((prev) => (prev === "dark" ? "light" : "dark"))}
                aria-label="Toggle theme"
              >
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<SettingsIcon />}
                onClick={() => setIsSettingsOpen(true)}
                aria-label="Open settings"
              >
                Settings
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 5 }}>
          <Stack spacing={3}>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2.5, md: 3 },
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                gap: 2,
                bgcolor: "background.paper",
                boxShadow: (theme) => (theme.palette.mode === "dark" ? "0 24px 60px rgba(0,0,0,0.35)" : "0 24px 60px rgba(0,0,0,0.08)"),
              }}
            >
              <Stack spacing={1}>
                <Chip
                  label="Live session"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                />
                <Typography variant="h4" fontWeight={800} lineHeight={1.2}>
                  Ask, iterate, and explore across models
                </Typography>
                <Typography color="text.secondary">
                  A sleek, ChatGPT-inspired surface for testing prompts, comparing tone, and keeping your sessions organized.
                </Typography>
              </Stack>
              <Stack spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                <Typography variant="overline" color="text.secondary">
                  Session status
                </Typography>
                <Chip
                  color={status.accent ? "primary" : "default"}
                  label={status.text}
                  variant={status.accent ? "filled" : "outlined"}
                  sx={{ px: 1.5, height: 36 }}
                />
              </Stack>
            </Paper>

            {showExamples && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundImage:
                    mode === "dark"
                      ? "linear-gradient(135deg, rgba(113,198,255,0.08), rgba(255,255,255,0.02))"
                      : "linear-gradient(135deg, rgba(11,106,216,0.06), rgba(255,255,255,0.6))",
                }}
              >
                <Grid container spacing={2}>
                  {examplePrompts.map((example) => (
                    <Grid key={example.title} item xs={12} sm={6} md={3}>
                      <Card variant="outlined" sx={{ height: "100%", bgcolor: "background.paper" }}>
                        <CardActionArea onClick={() => setInput(example.text)} sx={{ height: "100%" }}>
                          <CardContent>
                            <Typography fontWeight={700}>{example.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {example.text}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            <Paper
              variant="outlined"
              sx={{
                p: { xs: 1.5, md: 2 },
                minHeight: 420,
                maxHeight: "62vh",
                overflowY: "auto",
                backdropFilter: "blur(6px)",
                backgroundColor: (theme) => `${theme.palette.background.paper}e6`,
              }}
              ref={chatLogRef}
            >
              <Stack spacing={2}>
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  return (
                    <Stack
                      key={message.id}
                      direction={isUser ? "row-reverse" : "row"}
                      spacing={2}
                      alignItems="flex-start"
                    >
                      <Avatar
                        sx={{
                          bgcolor: isUser ? "primary.main" : "transparent",
                          color: isUser ? "grey.900" : "text.secondary",
                          border: isUser ? undefined : "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {isUser ? "You" : "AI"}
                      </Avatar>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          maxWidth: { xs: "100%", md: "75%" },
                          bgcolor: isUser ? "primary.main" : "background.paper",
                          color: isUser ? "grey.900" : "text.primary",
                        }}
                      >
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>{message.text}</Typography>
                        {showTimestamps && (
                          <Typography variant="caption" color={isUser ? "grey.800" : "text.secondary"} display="block" mt={1}>
                            {renderMeta(message.role, message.timestamp)}
                          </Typography>
                        )}
                      </Paper>
                    </Stack>
                  );
                })}

                {!messages.length && (
                  <Stack alignItems="center" spacing={1} py={4} color="text.secondary">
                    <Typography variant="body1">Start a conversation to see replies here.</Typography>
                    <Typography variant="body2">Pick an example prompt or ask your own question.</Typography>
                  </Stack>
                )}
              </Stack>
            </Paper>

            <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={2}>
                <TextField
                  id="user-input"
                  label="Message"
                  placeholder="Ask anything and press Enter"
                  multiline
                  minRows={3}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={isSending}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">💬</InputAdornment>,
                  }}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
                  <Button variant="text" color="inherit" onClick={handleClear} type="button">
                    Clear session
                  </Button>
                  <Button variant="contained" type="submit" disabled={isSending} endIcon={<SendIcon />}>
                    {isSending ? "Thinking" : "Send"}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Container>

        <Drawer anchor="right" open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
          <Box sx={{ width: 360, p: 3, display: "flex", flexDirection: "column", gap: 3 }} role="dialog" aria-label="Session settings">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Session settings
              </Typography>
              <IconButton aria-label="Close settings" onClick={() => setIsSettingsOpen(false)}>
                <SettingsIcon />
              </IconButton>
            </Stack>
            <Divider />

            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="tone-select-label">Response tone</InputLabel>
                <Select
                  labelId="tone-select-label"
                  id="tone-select"
                  value={tone}
                  label="Response tone"
                  onChange={(event) => setTone(event.target.value as Tone)}
                >
                  <MenuItem value="Balanced">Balanced</MenuItem>
                  <MenuItem value="Concise">Concise</MenuItem>
                  <MenuItem value="Detailed">Detailed</MenuItem>
                  <MenuItem value="Playful">Playful</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={<Switch checked={showTimestamps} onChange={(event) => setShowTimestamps(event.target.checked)} />}
                label="Show timestamps"
              />

              <FormControlLabel
                control={<Switch checked={typingPause} onChange={(event) => setTypingPause(event.target.checked)} />}
                label="Typing delay"
              />

              <FormControlLabel
                control={<Switch checked={mode === "dark"} onChange={() => setMode((prev) => (prev === "dark" ? "light" : "dark"))} />}
                label={mode === "dark" ? "Dark mode" : "Light mode"}
              />
            </Stack>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

export default App;
