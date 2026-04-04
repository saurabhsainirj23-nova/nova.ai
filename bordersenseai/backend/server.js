// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/auth.js";
import alertRoutes from "./routes/alerts.js";
import patrolRoutes from "./routes/routes.js";
import reportRoutes from "./routes/reports.js";
import userRoutes from "./routes/users.js";
import modelRoutes from "./routes/models.js";
import assetRoutes from "./routes/assetRoutes.js";
import aiModelRoutes from "./routes/aiModelRoutes.js";
import modelFeedbackRoutes from "./routes/modelFeedbackRoutes.js";

dotenv.config();

// Simple startup without background tasks
const app = express();

// ===== Middleware =====
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    credentials: true,
  })
);
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/routes", patrolRoutes);
app.use("/api/incident-report", reportRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/ai-models", aiModelRoutes);
app.use("/api/feedback", modelFeedbackRoutes);

// ===== Health Check =====
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ===== Socket.IO =====
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  socket.user = { id: "dev-user", username: "developer", role: "ADMIN" };
  next();
});

io.on("connection", (socket) => {
  console.log("🔌 socket connected:", socket.id);
  socket.emit("hello", "world");
  
  socket.on("disconnect", (reason) => {
    console.log("socket disconnected:", reason);
  });
});

app.set("io", io);

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ===== Start Server =====
const DEFAULT_PORT = 5000;
server.listen(DEFAULT_PORT, () => {
  console.log(`✅ Server running on http://localhost:${DEFAULT_PORT}`);
});