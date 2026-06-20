import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import taskRouter from './src/routes/taskRoutes.js';
import { securityHeaders } from './src/middleware/security.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';
import { requestLogger } from './src/middleware/requestLogger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────
app.use(helmet());
app.use(securityHeaders);

// ── Rate Limiting ─────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ── Core Middleware ───────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(requestLogger);

// ── Health Check ──────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TaskFlow API',
    timestamp: new Date().toISOString()
  });
});

// ── Routes ────────────────────────────────────
app.use('/api/v1/tasks', taskRouter);
// Also mount without version prefix for compatibility
app.use('/api/tasks', taskRouter);

// ── Error Handling ────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 TaskFlow API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Tasks API:    http://localhost:${PORT}/api/v1/tasks\n`);
});

export default app;
