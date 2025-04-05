import express from 'express';
import cors from 'cors';
import uploadRoute from './upload.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// 👋 Add this route right here!
app.get('/', (req, res) => {
  res.send('👋 Server is alive!');
});

// Your upload route
app.use('/api', uploadRoute);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
