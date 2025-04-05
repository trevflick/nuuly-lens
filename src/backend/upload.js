import express from "express";
import Replicate from "replicate";
import fs from "fs";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ✅ Load .env from the root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("✅ Token in upload.js:", process.env.REPLICATE_API_TOKEN);


// ✅ Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

console.log("✅ Token in upload.js:", process.env.REPLICATE_API_TOKEN);


router.post("/", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const image = req.files.image;
    const savePath = `uploads/${Date.now()}-${image.name}`;
    await image.mv(savePath);

    console.log("📥 Uploaded file saved at:", savePath);

    const output = await replicate.run(
      "andreasjansson/clip-features:75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
      {
        input: {
          image: fs.createReadStream(savePath),
        },
      }
    );

    console.log("🔁 Received vector:", output);
    res.json({ vector: output });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

export default router;
