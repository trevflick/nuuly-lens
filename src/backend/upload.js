
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    const output = await replicate.run(
      "andreasjansson/clip-features:75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
      {
        input: {
          image: `data:image/jpeg;base64,${base64Image}`,
          input: "a"
        }
      }
    );

    fs.unlinkSync(filePath); // cleanup temp image

    const vector = output?.[0]?.embedding;
    if (!vector) throw new Error("No vector returned.");

    res.json({ vector });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

export default router;
