import express from "express";
import fs from "fs";
import path from "path";
import Replicate from "replicate";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import FormData from "form-data";
import fetch from "node-fetch"; // this is to send image upload requests

const router = express.Router();

// directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// load the replicate token (we need it to run CLIP API)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// initialize Replicate API client with token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// path to the JSON file that's storing product vectors (just in this folder)
const datasetPath = path.join(__dirname, "revectorized_nuuly_data.json");

// POST route that handles image uploads
router.post("/", async (req, res) => {
  try {
    // check if an image was uploaded
    const file = req.files?.image;
    if (!file) return res.status(400).send("No file uploaded");

    // save the file locally
    const uploadPath = path.join(__dirname, "../uploads", `${Date.now()}-${file.name}`);
    await file.mv(uploadPath);
    console.log("Saved locally at:", uploadPath);

    // upload the image to my cloudflare worker
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

    // parse response from the cloudflare worker
    const { url: cloudflareImageUrl } = await cloudRes.json();
    console.log("Cloudflare image URL:", cloudflareImageUrl);

    // step 2: send the new public image URL to Replicate for embedding
    console.log("Sending image to Replicate:", cloudflareImageUrl);

    // this value might change if they update their model and delete this version
    const output = await replicate.run(
      "andreasjansson/clip-features:75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
      {
        input: {
          inputs: `${cloudflareImageUrl}`, 
        },
      }
    );

    console.log("Raw output from Replicate:", output);

    // extract the returned vector from Replicate's output.
    // this specific model was tricky, i kept pulling the wrong value
    // (the documentation wasn't good)
    const userVector = output[0]?.embedding;

    if (!userVector || !Array.isArray(userVector)) {
      console.error("Could not extract a valid vector. Full output:", output);
      throw new Error("No valid embedding returned from Replicate");
    }

    console.log("Final selected userVector:", userVector.slice(0, 5));

    // step 3: load the dataset for comparison
    const rawData = fs.readFileSync(datasetPath);
    const { products } = JSON.parse(rawData);

    // cosine similarity calculation
    function cosineSimilarity(vecA, vecB) {
      const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
      const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
      const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
      return dot / (normA * normB);
    }

    // step 4: find the top 3 products with the highest similarity score
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

    // return topMatches and the the photo
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
