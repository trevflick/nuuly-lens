import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import Replicate from "replicate";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import FormData from "form-data";
import fetch from "node-fetch";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const datasetPath = path.join(__dirname, "revectorized_nuuly_data.json");

router.post("/", async (req, res) => {
  try {
    const file = req.files?.image;
    if (!file) return res.status(400).send("No file uploaded");

    // Save the file locally
    const uploadPath = path.join(__dirname, "../../uploads", `${Date.now()}-${file.name}`);
    await file.mv(uploadPath);
    console.log("📥 Saved locally at:", uploadPath);

    // Upload to Cloudflare Worker
    const formData = new FormData();
    formData.append("image", fs.createReadStream(uploadPath));

    const cloudRes = await fetch("https://image-uploader.trevflick.workers.dev/upload", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!cloudRes.ok) {
      throw new Error("Cloudflare upload failed");
    }

    const { url: cloudflareImageUrl } = await cloudRes.json();
    console.log("Cloudflare image URL:", cloudflareImageUrl);

    // Send Cloudflare image URL to Replicate for vector embedding
    console.log("Sending image to Replicate:", cloudflareImageUrl);

    const output = await replicate.run(
      "andreasjansson/clip-features:75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
      {
        input: {
          inputs: `${cloudflareImageUrl}`, 
        },
      }
    );

    console.log("📦 Raw output from Replicate:", output);

    const userVector = output[0]?.embedding;

    if (!userVector || !Array.isArray(userVector)) {
      console.error("Could not extract a valid vector. Full output:", output);
      throw new Error("No valid embedding returned from Replicate");
    }

    console.log("Final selected userVector:", userVector.slice(0, 5));

    // Load the Nuuly dataset
    const rawData = fs.readFileSync(datasetPath);
    const { products } = JSON.parse(rawData);

    // Cosine similarity calculation
    function cosineSimilarity(vecA, vecB) {
      const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
      const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
      const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
      return dot / (normA * normB);
    }

    // Rank all products by similarity
    const scoredMatches = products
      .map(product => {
        const productVector = Array.isArray(product.vector) && product.vector[0]?.embedding;
        if (!productVector) return null;

        const sim = cosineSimilarity(userVector, productVector);
        return { product, similarity: sim };
      })
      .filter(Boolean)
      .sort((a, b) => b.similarity - a.similarity);

    const topMatches = scoredMatches.slice(0, 3);

    res.json({
      topMatches,
      uploadedImageUrl: cloudflareImageUrl,
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Upload failed: " + err.message);
  }
});

export default router;
