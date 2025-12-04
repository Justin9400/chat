import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  alpha,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
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
              ? "radial-gradient(circle at 15% 20%, rgba(139,200,255,0.06), transparent 25%), radial-gradient(circle at 85% 0%, rgba(199,146,234,0.08), transparent 35%)"
              : "radial-gradient(circle at 15% 20%, rgba(16, 121, 255, 0.05), transparent 25%), radial-gradient(circle at 85% 0%, rgba(124, 58, 237, 0.06), transparent 35%)",
        }}
      >
        <AppBar position="sticky" elevation={0} color="transparent" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Toolbar sx={{ gap: 2, justifyContent: "space-between", py: 1.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2), color: "primary.main", fontWeight: 800 }}>
                AI
              </Avatar>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                  Nova Studio
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  Minimal chat desk
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Choose a model">
                <FormControl size="small" sx={{ minWidth: 180 }}>
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
              </Tooltip>

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

              <Tooltip title="Session settings">
                <IconButton
                  color="inherit"
                  onClick={() => setIsSettingsOpen(true)}
                  aria-label="Open settings"
                  sx={{ border: 1, borderColor: "divider" }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="md"
          sx={{
            py: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: "calc(100vh - 80px)",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" gap={1}>
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={800}>
                Chat without the clutter
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Focus on the transcript while keeping controls within reach.
              </Typography>
            </Stack>
            <Chip
              color={status.accent ? "primary" : "default"}
              label={status.text}
              variant={status.accent ? "filled" : "outlined"}
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, sm: 2.5 },
              flex: 1,
              minHeight: { xs: 360, md: 420 },
              maxHeight: { md: "60vh" },
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

          {showExamples && (
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2, sm: 2.5 },
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography fontWeight={700}>Example prompts</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {examplePrompts.map((example) => (
                  <Chip
                    key={example.title}
                    label={example.text}
                    variant="outlined"
                    onClick={() => setInput(example.text)}
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Stack>
            </Paper>
          )}

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
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
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
