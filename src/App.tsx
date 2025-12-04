import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  alpha,
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
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

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
          primary: { main: mode === "dark" ? "#8bc8ff" : "#0b6bcb" },
          secondary: { main: mode === "dark" ? "#c792ea" : "#7c3aed" },
          background: {
            default: mode === "dark" ? "#070c14" : "#f5f7fb",
            paper: mode === "dark" ? alpha("#0f1c2b", 0.9) : "#ffffff",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", system-ui, -apple-system, sans-serif',
          h4: { fontWeight: 800, letterSpacing: -0.3 },
        },
        shape: { borderRadius: 16 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                border: mode === "dark" ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
                backdropFilter: "blur(12px)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 700,
                letterSpacing: 0,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backdropFilter: "blur(14px)",
                backgroundImage: "linear-gradient(120deg, rgba(139,200,255,0.08), rgba(199,146,234,0.08))",
              },
            },
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
          backgroundImage:
            mode === "dark"
              ? "radial-gradient(circle at 10% 20%, rgba(139,200,255,0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(199,146,234,0.12), transparent 35%)"
              : "radial-gradient(circle at 10% 20%, rgba(16, 121, 255, 0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(124, 58, 237, 0.12), transparent 35%)",
          pb: 6,
        }}
      >
        <AppBar position="sticky" elevation={0} color="transparent" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Toolbar sx={{ gap: 2, justifyContent: "space-between", py: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Paper
                elevation={0}
                sx={{
                  width: 44,
                  height: 44,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.14),
                  color: "primary.main",
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                AI
              </Paper>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                  Nova Studio
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  Conversational Lab
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
              <FormControl size="small" sx={{ minWidth: 230 }}>
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
                  MenuProps={{ PaperProps: { elevation: 0 } }}
                >
                  {models.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      <Stack spacing={0.25}>
                        <Typography fontWeight={700}>{model.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {model.description}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Tooltip title={mode === "dark" ? "Switch to light" : "Switch to dark"}>
                <IconButton
                  color="inherit"
                  onClick={() => setMode((prev) => (prev === "dark" ? "light" : "dark"))}
                  aria-label="Toggle theme"
                  sx={{ border: 1, borderColor: "divider" }}
                >
                  {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                color="primary"
                startIcon={<SettingsIcon />}
                onClick={() => setIsSettingsOpen(true)}
                aria-label="Open settings"
              >
                Session controls
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2.5, sm: 3 },
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                gap: 2,
                backgroundImage:
                  mode === "dark"
                    ? "linear-gradient(135deg, rgba(139,200,255,0.1), rgba(199,146,234,0.08))"
                    : "linear-gradient(135deg, rgba(16, 121, 255, 0.08), rgba(124, 58, 237, 0.07))",
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Chip label="Live" color="primary" size="small" />
                  <Chip label={selectedModelLabel} variant="outlined" color="secondary" size="small" />
                </Stack>
                <Typography variant="h4" gutterBottom>
                  Ask anything, iterate faster
                </Typography>
                <Typography color="text.secondary" maxWidth={620}>
                  Switch models, tweak tone, and jump into curated prompts inspired by modern AI chat surfaces.
                  Responsive layout keeps focus on your conversation.
                </Typography>
              </Box>
              <Stack spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                <Chip
                  color={status.accent ? "primary" : "default"}
                  label={status.text}
                  variant={status.accent ? "filled" : "outlined"}
                  sx={{ fontWeight: 700 }}
                />
                {isSending && <LinearProgress sx={{ width: { xs: "100%", md: 260 } }} />}
              </Stack>
            </Paper>

            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} md={4}>
                <Stack spacing={2} height="100%">
                  <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography fontWeight={700}>Session quick toggles</Typography>
                      <Tooltip title="Open all preferences">
                        <IconButton size="small" onClick={() => setIsSettingsOpen(true)} aria-label="Open settings">
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Stack spacing={1.5}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="tone-select-label-inline">Response tone</InputLabel>
                        <Select
                          labelId="tone-select-label-inline"
                          id="tone-select-inline"
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
                        label="Typing indicator"
                      />
                      <FormControlLabel
                        control={<Switch checked={mode === "dark"} onChange={() => setMode((prev) => (prev === "dark" ? "light" : "dark"))} />}
                        label={mode === "dark" ? "Dark mode" : "Light mode"}
                      />
                    </Stack>
                  </Paper>

                  {showExamples && (
                    <Paper variant="outlined" sx={{ p: 2.5 }}>
                      <Typography fontWeight={700} gutterBottom>
                        Quick ideas
                      </Typography>
                      <Grid container spacing={1.5}>
                        {examplePrompts.map((example) => (
                          <Grid key={example.title} item xs={12} sm={6} md={12}>
                            <Card
                              variant="outlined"
                              sx={{
                                height: "100%",
                                borderColor: "divider",
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                              }}
                            >
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
                </Stack>
              </Grid>

              <Grid item xs={12} md={8}>
                <Stack spacing={2} height="100%">
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      minHeight: 420,
                      maxHeight: "65vh",
                      overflowY: "auto",
                      display: "flex",
                    }}
                    ref={chatLogRef}
                  >
                    <Stack spacing={2} width="100%">
                      {messages.map((message) => {
                        const isUser = message.role === "user";
                        return (
                          <Stack
                            key={message.id}
                            direction="row"
                            spacing={1.5}
                            justifyContent={isUser ? "flex-end" : "flex-start"}
                            alignItems="flex-start"
                          >
                            {!isUser && (
                              <Avatar
                                sx={{
                                  bgcolor: alpha(theme.palette.primary.main, 0.18),
                                  color: "primary.main",
                                  border: 1,
                                  borderColor: alpha(theme.palette.primary.main, 0.3),
                                  fontWeight: 800,
                                }}
                              >
                                AI
                              </Avatar>
                            )}
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                maxWidth: "80%",
                                bgcolor: isUser
                                  ? alpha(theme.palette.primary.main, mode === "dark" ? 0.25 : 0.15)
                                  : alpha(theme.palette.background.paper, 0.9),
                                color: isUser ? theme.palette.getContrastText(theme.palette.primary.main) : "text.primary",
                                borderColor: isUser ? alpha(theme.palette.primary.main, 0.4) : "divider",
                              }}
                            >
                              <Typography sx={{ whiteSpace: "pre-wrap" }}>{message.text}</Typography>
                              {showTimestamps && (
                                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                  {renderMeta(message.role, message.timestamp)}
                                </Typography>
                              )}
                            </Paper>
                            {isUser && (
                              <Avatar sx={{ bgcolor: "grey.800", color: "background.paper", fontWeight: 700 }}>You</Avatar>
                            )}
                          </Stack>
                        );
                      })}

                      {!messages.length && (
                        <Stack alignItems="center" spacing={1} py={6} color="text.secondary">
                          <Typography variant="body1" fontWeight={700}>
                            Your conversation will appear here
                          </Typography>
                          <Typography variant="body2">
                            Pick an example or ask your own question to get started.
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Paper>

                  <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack spacing={2}>
                      <TextField
                        id="user-input"
                        label="Message"
                        placeholder="Send a message..."
                        multiline
                        minRows={3}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        disabled={isSending}
                        fullWidth
                      />
                      <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Typography variant="body2" color="text.secondary">
                          Press Enter to send, Shift + Enter for a new line.
                        </Typography>
                        <Stack direction="row" spacing={1.5}>
                          <Button variant="text" color="inherit" onClick={handleClear} type="button">
                            Clear
                          </Button>
                          <Button variant="contained" type="submit" disabled={isSending}>
                            {isSending ? "Thinking" : "Send"}
                          </Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>

        <Drawer anchor="right" open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
          <Box sx={{ width: 360, p: 3, display: "flex", flexDirection: "column", gap: 3 }} role="dialog" aria-label="Session settings">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Session settings
              </Typography>
              <IconButton aria-label="Close settings" onClick={() => setIsSettingsOpen(false)}>
                <CloseIcon />
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
                label="Typing indicator"
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
