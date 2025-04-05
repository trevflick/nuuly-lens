// calling clip through backend to vectorize the photos
// (can do this part locally for the db items but for the api i need it set up anyways so might as well just do it all through this)

import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
dotenv.config();

const app = express();
const port = 4000;
const upload = multer({ dest: 'uploads/' });

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const CLIP_VERSION = 'f6d2e367f3a10bd93c2b29e8b50d70ec3d8507116e546c608ee3555c1e40302c'; // andreasjansson/clip-features

app.use(express.json());

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, try again later.' }
});

app.post('/api/vectorize', limiter, upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageData = fs.readFileSync(imagePath);

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: CLIP_VERSION,
        input: {
          image: `data:image/jpeg;base64,${imageData.toString('base64')}`
        }
      })
    });

    const result = await response.json();
    fs.unlinkSync(imagePath); // cleanup temp file

    if (result.output) {
      res.json({ vector: result.output });
    } else {
      res.status(422).json({ error: result.detail || 'No vector returned' });
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 CLIP Proxy running at http://localhost:${port}/api/vectorize`);
});
