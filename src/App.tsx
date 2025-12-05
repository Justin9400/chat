import {
  Add,
  AutoFixHighRounded,
  BoltRounded,
  HistoryRounded,
  MicNoneRounded,
  MoreHorizRounded,
  OutlinedFlagRounded,
  RefreshRounded,
  SendRounded,
  SettingsRounded,
  ShieldMoonRounded,
  StarsRounded,
  ThumbDownOffAltRounded,
  ThumbUpOffAltRounded,
  TravelExploreRounded,
  UploadFileRounded,
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
} from "@mui/material";
import { useMemo, useState } from "react";

const introCards = [
  "Plan a South Island exploration",
  "Mystery novel with a time travel twist",
  "Efficiency boost through automation",
  "Brainstorm sustainable materials for packaging redesign",
  "Elevate my pitch with persuasive storytelling",
  "Boost engagement for my fitness app",
  "Overwhelmed by open tabs? Ask for a summary",
  "Proofread the email to the landlord",
  "Pick the best parts for my budget gaming PC",
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
            default: "#0b0d12",
            paper: "#10131a",
          },
          primary: { main: "#c8d9ff" },
          secondary: { main: "#9ca3af" },
          text: {
            primary: "#e6ebf3",
            secondary: "#959db0",
          },
          divider: "#1c2432",
        },
        shape: { borderRadius: 14 },
        typography: {
          fontFamily: '"Inter", "Roboto", system-ui, -apple-system, sans-serif',
          h3: { fontWeight: 700, letterSpacing: -0.3, fontSize: "2rem" },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                border: "1px solid #1c2430",
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "#0d0f13",
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
          "html, body, #root": { height: "100%", margin: 0, backgroundColor: "#0b0d12" },
          body: { color: "#e6ebf3" },
          "button, input, textarea, select": { font: "inherit" },
        }}
      />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(800px circle at 20% 20%, rgba(77,126,255,0.08), transparent 60%), radial-gradient(600px circle at 80% 30%, rgba(88,232,255,0.06), transparent 55%)",
            opacity: 0.9,
          }}
        />
        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            width: 92,
            py: 3,
            borderRight: `1px solid ${theme.palette.divider}`,
            background: "rgba(13,15,19,0.6)",
          }}
        >
          <IconButton color="inherit" sx={{ border: `1px solid ${theme.palette.divider}`, bgcolor: "#11151c" }}>
            <Add />
          </IconButton>
          {[HistoryRounded, BarChartRounded, RefreshRounded].map((Icon, idx) => (
            <IconButton
              key={idx}
              color="inherit"
              sx={{ border: `1px solid ${theme.palette.divider}`, width: 44, height: 44, bgcolor: "#0f1218" }}
            >
              <Icon />
            </IconButton>
          ))}
          <Box flex={1} />
          <Avatar sx={{ bgcolor: "#1f2937", color: "white" }}>A</Avatar>
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Paper
            square
            elevation={0}
            sx={{
              px: { xs: 2, md: 4 },
              py: 2,
              border: "none",
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: "rgba(16,18,24,0.7)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#1b2330", color: "#c8d9ff", fontWeight: 700 }}>
                  GPT
                </Avatar>
                <Stack spacing={0.2}>
                  <Typography fontWeight={700}>ChatGPT</Typography>
                  <Typography variant="body2" color="text.secondary">
                    GPT-4o mini
                  </Typography>
                </Stack>
                <Chip label="Preview" size="small" sx={{ bgcolor: "#121723", color: "#c8d9ff" }} />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="History">
                  <IconButton color="inherit">
                    <HistoryRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Insights">
                  <IconButton color="inherit">
                    <BarChartRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="New chat">
                  <IconButton color="inherit">
                    <Add />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Settings">
                  <IconButton color="inherit">
                    <SettingsRounded />
                  </IconButton>
                </Tooltip>
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
              gap: 3,
              py: 5,
            }}
          >
            {!hasConversation && (
              <Stack spacing={5} alignItems="center" textAlign="center" sx={{ flex: 1 }}>
                <Stack spacing={2} alignItems="center">
                  <Avatar
                    sx={{ width: 56, height: 56, bgcolor: "#111827", color: "#c8d9ff", fontWeight: 700 }}
                  >
                    GPT
                  </Avatar>
                  <Typography variant="h3">What can I help you with?</Typography>
                  <Typography color="text.secondary">
                    Explore GPT-4o mini: fast, intelligent, and cost-effective.
                  </Typography>
                  <Stack direction="row" spacing={1} color="text.secondary">
                    <Typography variant="body2">
                      <BoltRounded fontSize="small" sx={{ verticalAlign: "middle" }} /> Fast
                    </Typography>
                    <Typography variant="body2">•</Typography>
                    <Typography variant="body2">Reliable</Typography>
                    <Typography variant="body2">•</Typography>
                    <Typography variant="body2">Secure</Typography>
                  </Stack>
                </Stack>

                <Stack spacing={1.5} width="100%" maxWidth="1024px">
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    flexWrap="wrap"
                    justifyContent="center"
                  >
                    {introCards.map((card) => (
                      <Paper
                        key={card}
                        sx={{
                          px: 2,
                          py: 1.6,
                          bgcolor: "rgba(16,20,27,0.8)",
                          borderColor: "#1a2331",
                          cursor: "pointer",
                          minWidth: 240,
                          flex: "0 1 280px",
                          transition: "transform 120ms ease, border-color 120ms ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            borderColor: "#2b3a51",
                          },
                        }}
                        onClick={() => handleStart(card)}
                      >
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <StarsRounded fontSize="small" sx={{ color: "#c8d4ff" }} />
                          <Typography textAlign="left" color="text.primary">
                            {card}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%" maxWidth="1024px">
                  {featureColumns.map((column) => (
                    <Paper
                      key={column.title}
                      sx={{
                        flex: 1,
                        p: 2.5,
                        bgcolor: "rgba(16,19,26,0.85)",
                        borderColor: "#1a2331",
                      }}
                    >
                      <Stack spacing={1.5} alignItems="flex-start">
                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                          {column.icon}
                          <Typography fontWeight={700}>{column.title}</Typography>
                        </Stack>
                        <Stack spacing={1.2} alignItems="flex-start" width="100%">
                          {column.items.map((item) => (
                            <Paper
                              key={item}
                              sx={{
                                width: "100%",
                                p: 1.25,
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
                          bgcolor: message.role === "assistant" ? "#0f172a" : "#1f2937",
                          color: "#e8ecf5",
                          fontWeight: 600,
                        }}
                      >
                        {message.role === "assistant" ? "G" : "Y"}
                      </Avatar>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: message.role === "assistant" ? "rgba(17,23,34,0.9)" : "rgba(16,18,24,0.8)",
                          borderColor: "#1b2330",
                          width: "100%",
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          <Typography fontWeight={600}>
                            {message.role === "assistant" ? "ChatGPT" : "You"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            · just now
                          </Typography>
                          {message.role === "assistant" && (
                            <Chip
                              label="GPT-4o mini"
                              size="small"
                              sx={{ bgcolor: "#111827", color: "#c8d9ff" }}
                            />
                          )}
                        </Stack>
                        <Typography color="text.primary" sx={{ lineHeight: 1.7 }}>
                          {message.text}
                        </Typography>
                        {message.role === "assistant" && (
                          <Stack direction="row" spacing={1} mt={1.5} color="text.secondary">
                            <IconButton size="small" color="inherit">
                              <ThumbUpOffAltRounded fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="inherit">
                              <ThumbDownOffAltRounded fontSize="small" />
                            </IconButton>
                            <Chip label="Tiny" size="small" sx={{ bgcolor: "#111827", color: "#e8ecf5" }} />
                            <IconButton size="small" color="inherit">
                              <MoreHorizRounded fontSize="small" />
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
              bgcolor: "rgba(13,15,21,0.9)",
              px: { xs: 2, md: 4 },
              py: 2.5,
              backdropFilter: "blur(8px)",
              position: "sticky",
              bottom: 0,
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
                  p: 1,
                  bgcolor: "rgba(13,16,22,0.9)",
                  borderColor: "#1b2330",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                          <TravelExploreRounded fontSize="small" />
                          <MicNoneRounded fontSize="small" />
                          <UploadFileRounded fontSize="small" />
                          <StarsRounded fontSize="small" />
                        </Stack>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label="GPT-4o mini" size="small" sx={{ bgcolor: "#111927", color: "#c0d3ff" }} />
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
