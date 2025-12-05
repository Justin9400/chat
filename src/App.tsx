import {
  Add,
  AutoFixHighRounded,
  BarChartRounded,
  BoltRounded,
  HistoryRounded,
  MoreHorizRounded,
  OutlinedFlagRounded,
  SendRounded,
  SettingsRounded,
  ShieldMoonRounded,
  StarsRounded,
  ThumbDownOffAltRounded,
  ThumbUpOffAltRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  GlobalStyles,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useMemo, useState } from "react";

const introCards = [
  "What are some quick weeknight dinners I can make?",
  "How do I prepare for a job interview in tech?",
  "Can you suggest a 3-day itinerary for Barcelona?",
];

const featureColumns = [
  {
    title: "Examples",
    items: [
      ' "Write a 2-page content summary" ',
      ' "Explain quantum computing in simple terms" ',
      ' "Got any creative ideas for a 10 year old’s birthday?" ',
    ],
    icon: <AutoFixHighRounded fontSize="small" />,
  },
  {
    title: "Capabilities",
    items: [
      "Retrieval from beyond training data",
      "Formatting, tools, and app integrations",
      "Image generation and editing",
    ],
    icon: <BoltRounded fontSize="small" />,
  },
  {
    title: "Limitations",
    items: [
      "May occasionally generate incorrect information",
      "May occasionally produce harmful instructions or biased content",
      "Provides limited context on mobile due to screen space",
    ],
    icon: <ShieldMoonRounded fontSize="small" />,
  },
];

const defaultMessages = [
  {
    id: "1",
    role: "user" as const,
    text: "test",
  },
  {
    id: "2",
    role: "assistant" as const,
    text: "I'm ready to help! What would you like to know more about?",
  },
];

const useTheme = () =>
  useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          background: {
            default: "#0e1116",
            paper: "#12161e",
          },
          primary: { main: "#c0d3ff" },
          secondary: { main: "#9ca3af" },
          text: {
            primary: "#e8ecf5",
            secondary: "#9aa1b2",
          },
          divider: "#1b202a",
        },
        shape: { borderRadius: 16 },
        typography: {
          fontFamily: '"Inter", "Roboto", system-ui, -apple-system, sans-serif',
          h3: { fontWeight: 700, letterSpacing: -0.3 },
          subtitle1: { color: "#cdd5e5" },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                border: "1px solid #1c212b",
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "#0e1116",
              },
            },
          },
        },
      }),
    []
  );

function App() {
  const theme = useTheme();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<typeof defaultMessages>([]);
  const [model, setModel] = useState("gpt-4o-mini");
  const hasConversation = messages.length > 0;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now().toString(), role: "user" as const, text: input.trim() };
    const assistantMessage =
      messages.length === 0
        ? defaultMessages[1]
        : {
            id: `${Date.now()}-a`,
            role: "assistant" as const,
            text: "Got it! I'll take a look and get back to you.",
          };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput("");
  };

  const handleStart = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          ":root": { fontFamily: '"Inter", "Roboto", system-ui, -apple-system, sans-serif' },
          "html, body, #root": { height: "100%", margin: 0, backgroundColor: "#0e1116" },
          body: { color: "#e8ecf5" },
          "button, input, textarea, select": { font: "inherit" },
        }}
      />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Paper
            square
            elevation={0}
            sx={{
              px: { xs: 2, md: 4 },
              py: 2,
              border: "none",
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: "#0f1218",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Stack spacing={0.2}>
                  <Typography fontWeight={700}>ChatGPT</Typography>
                  <Typography variant="body2" color="text.secondary">
                    5.1
                  </Typography>
                </Stack>
                <Chip label="Preview" size="small" sx={{ bgcolor: "#111927", color: "#c0d3ff" }} />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                {[HistoryRounded, BarChartRounded, Add, SettingsRounded].map((Icon, idx) => (
                  <Tooltip key={idx} title="">
                    <IconButton color="inherit" size="small" sx={{ bgcolor: "transparent" }}>
                      <Icon />
                    </IconButton>
                  </Tooltip>
                ))}
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#1f2937" }}>A</Avatar>
              </Stack>
            </Stack>
          </Paper>

          <Container
            maxWidth="lg"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              py: 4,
            }}
          >
            {!hasConversation && (
              <Stack spacing={5} alignItems="center" textAlign="center" sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "radial-gradient(circle at 30% 30%, #2a3750, #121720 70%)",
                    border: "1px solid #1c212b",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
                  }}
                >
                  <Typography variant="h5" fontWeight={700} color="#c0d3ff">
                    GPT
                  </Typography>
                </Box>
                <Stack spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary">
                    <Typography variant="body2">★</Typography>
                    <Typography variant="body2">∞</Typography>
                    <Typography variant="body2">✔︎</Typography>
                  </Stack>
                  <Typography variant="h3">What can I help you with?</Typography>
                  <Typography color="text.secondary">Explore GPT-4o mini: fast, intelligent, and cost-effective.</Typography>
                </Stack>

                <Stack spacing={1.5} width="100%" maxWidth="1000px">
                  <Stack direction={{ xs: "column", md: "row" }} spacing={1.25} flexWrap="wrap" justifyContent="center">
                    {introCards.map((card) => (
                      <Paper
                        key={card}
                        sx={{
                          px: 2.5,
                          py: 1.75,
                          bgcolor: "#121720",
                          borderColor: "#1c212b",
                          cursor: "pointer",
                          minWidth: 260,
                          flex: "0 1 300px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        }}
                        onClick={() => handleStart(card)}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <StarsRounded fontSize="small" sx={{ color: "#c8d4ff" }} />
                          <Typography textAlign="left" color="text.primary">
                            {card}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%">
                  {featureColumns.map((column) => (
                    <Paper key={column.title} sx={{ flex: 1, p: 2.25, bgcolor: "#12161e" }}>
                      <Stack spacing={1.5} alignItems="flex-start">
                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                          {column.icon}
                          <Typography fontWeight={700}>{column.title}</Typography>
                        </Stack>
                        <Stack spacing={1.15} alignItems="flex-start" width="100%">
                          {column.items.map((item) => (
                            <Paper
                              key={item}
                              sx={{
                                width: "100%",
                                p: 1.3,
                                bgcolor: "#0f131a",
                                borderColor: "#1b2330",
                              }}
                            >
                              <Typography variant="body2" textAlign="left" color="text.primary">
                                {item}
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            )}

            {hasConversation && (
              <Stack spacing={3} flex={1} width="100%" maxWidth="900px" mx="auto">
                {messages.map((message) => (
                  <Stack key={message.id} spacing={1.5}>
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: message.role === "assistant" ? "#1a2230" : "#1a2230",
                          color: "#e8ecf5",
                        }}
                      >
                        {message.role === "assistant" ? "D" : message.role === "user" ? "S" : ""}
                      </Avatar>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: message.role === "assistant" ? "#111620" : "#0f1218",
                          borderColor: "#1c212b",
                          width: "100%",
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          <Typography fontWeight={600}>
                            {message.role === "assistant" ? "DeepSeek-R1" : "You"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            · Just now
                          </Typography>
                          {message.role === "assistant" && (
                            <Chip label="Tiny" size="small" sx={{ bgcolor: "#1b2330", color: "#9aa1b2" }} />
                          )}
                        </Stack>
                        <Typography color="text.primary">{message.text}</Typography>
                        {message.role === "assistant" && (
                          <Stack direction="row" spacing={1} mt={1.5} color="text.secondary">
                            <IconButton size="small" color="inherit">
                              <ThumbUpOffAltRounded />
                            </IconButton>
                            <IconButton size="small" color="inherit">
                              <ThumbDownOffAltRounded />
                            </IconButton>
                            <IconButton size="small" color="inherit">
                              <MoreHorizRounded />
                            </IconButton>
                          </Stack>
                        )}
                      </Paper>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Container>

          <Box
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: "#0f131a",
              px: { xs: 2, md: 4 },
              py: 2.5,
            }}
          >
            <Stack spacing={1} maxWidth="900px" mx="auto">
              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                <OutlinedFlagRounded fontSize="small" />
                <Typography variant="body2">Help us understand and assess safety in AI.</Typography>
                <Button variant="outlined" size="small" color="inherit" sx={{ borderColor: theme.palette.divider }}>
                  Explore
                </Button>
              </Stack>

              <Paper
                sx={{
                  p: 1.25,
                  bgcolor: "#0f131a",
                  borderColor: "#1b2330",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Ask anything"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  multiline
                  minRows={1}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Select
                            value={model}
                            onChange={(event: SelectChangeEvent<string>) => setModel(event.target.value as string)}
                            size="small"
                            variant="outlined"
                            sx={{
                              minWidth: 140,
                              bgcolor: "#0f131a",
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1b2330" },
                              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2c3747" },
                              "& .MuiSelect-icon": { color: "#c0d3ff" },
                            }}
                          >
                            <MenuItem value="gpt-4o-mini">GPT-4o mini</MenuItem>
                            <MenuItem value="gpt-4o">GPT-4o</MenuItem>
                            <MenuItem value="deepseek-r1">DeepSeek-R1</MenuItem>
                          </Select>
                          <IconButton color="inherit" onClick={handleSend}>
                            <SendRounded />
                          </IconButton>
                        </Stack>
                      </InputAdornment>
                    ),
                  }}
                />
              </Paper>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                ChatGPT can make mistakes. Consider checking important information.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
