import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

// Routes
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.router.js';
import uploadRoutes from './routes/upload.js';
import listingRouter from './routes/listing.route.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('DB Connection Error:', err));

// Create app
const __dirname = path.resolve();
const app = express();


// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRoutes);
app.use('/api/listing', listingRouter);

// Serve frontend (client build)
// app.use(express.static(path.join(__dirname, '/client/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

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

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
