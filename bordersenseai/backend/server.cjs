const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Demo mode - login disabled' });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('🔌 socket connected:', socket.id);
  socket.emit('hello', 'world');
});

app.set('io', io);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});