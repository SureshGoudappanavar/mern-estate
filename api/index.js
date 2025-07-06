import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.router.js';
import uploadRoutes from './routes/upload.js';
import listingRouter from './routes/listing.route.js';

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('DB Connection Error:', err));

// Set __dirname (needed in ES Module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express App
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRoutes);
app.use('/api/listing', listingRouter);

import fs from 'fs';

// Serve frontend in production only if build exists
const clientPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientPath)) {
  app.use(express.static(clientPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}


// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Use dynamic PORT (for Render or Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
