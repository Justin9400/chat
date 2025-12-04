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
          primary: { main: mode === "dark" ? "#8bc8ff" : "#1a73e8" },
          background: {
            default: mode === "dark" ? "#0b1622" : "#f7f9fc",
            paper: mode === "dark" ? "#0f1c2b" : "#ffffff",
          },
        },
        shape: { borderRadius: 14 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                border: mode === "dark" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
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
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar position="sticky" elevation={0} color="transparent" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Toolbar sx={{ gap: 2, justifyContent: "space-between" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Paper
                elevation={0}
                sx={{ width: 36, height: 36, display: "grid", placeItems: "center", bgcolor: "primary.main", color: "background.paper" }}
              >
                ⚡
              </Paper>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                  AI Studio
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Chatboard
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
              <FormControl size="small" sx={{ minWidth: 240 }}>
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

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Live session
                </Typography>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Ask anything and iterate
                </Typography>
                <Typography color="text.secondary">
                  Switch between models, adjust preferences, and explore example prompts to jump-start your conversation.
                </Typography>
              </Box>
              <Chip
                color={status.accent ? "primary" : "default"}
                label={status.text}
                variant={status.accent ? "filled" : "outlined"}
              />
            </Stack>

            {showExamples && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {examplePrompts.map((example) => (
                    <Grid key={example.title} item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
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
              sx={{ p: 2, minHeight: 360, maxHeight: "65vh", overflowY: "auto" }}
              ref={chatLogRef}
            >
              <Stack spacing={2}>
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  return (
                    <Stack
                      key={message.id}
                      direction="row"
                      spacing={2}
                      justifyContent={isUser ? "flex-end" : "flex-start"}
                      alignItems="flex-start"
                    >
                      {!isUser && (
                        <Avatar sx={{ bgcolor: "primary.main", color: "background.paper" }}>AI</Avatar>
                      )}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          maxWidth: "70%",
                          bgcolor: isUser ? "primary.main" : "background.paper",
                          color: isUser ? "grey.900" : "text.primary",
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
                        <Avatar sx={{ bgcolor: "grey.800", color: "background.paper" }}>You</Avatar>
                      )}
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

            <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <TextField
                  id="user-input"
                  label="Message"
                  placeholder="Send a message..."
                  multiline
                  minRows={2}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={isSending}
                  fullWidth
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="text" color="inherit" onClick={handleClear} type="button">
                    Clear
                  </Button>
                  <Button variant="contained" type="submit" disabled={isSending}>
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
