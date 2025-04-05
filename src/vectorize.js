// this is the vectorizer file for users!
// vectorizeData.js is just for vectorizing my sample images
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const endpoint = 'https://api.replicate.com/v1/predictions';
const modelVersion = 'bf84f9f8e2ad472da7f7f9a3094f08ff49bb44a8a215216c5f77f53db5aaaf9c';

const data = JSON.parse(fs.readFileSync('data_with_local_images.json'));

const headers = {
  'Authorization': `Token ${REPLICATE_API_TOKEN}`,
  'Content-Type': 'application/json'
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function vectorizeImages() {
  const vectorizedProducts = [];

  for (let i = 0; i < data.products.length; i++) {
    const product = data.products[i];
    const imagePath = path.resolve(__dirname, product.image);

    try {
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');

      console.log(`🔁 [${i + 1}/${data.products.length}] Sending: ${product.image}`);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          version: modelVersion,
          input: {
            image: `data:image/jpeg;base64,${base64Image}`
          }
        })
      });

      const result = await res.json();

      if (result.output) {
        product.vector = result.output;
        vectorizedProducts.push(product);
      } else {
        console.warn(`Failed for ${product.image}:`, result);
        product.vector = null;
        vectorizedProducts.push(product);
      }
    } catch (err) {
      console.error(`Error processing ${product.image}:`, err);
    }

    await delay(1500); // Replicate rate limit safety
  }

  fs.writeFileSync('vectorized_data.json', JSON.stringify({ products: vectorizedProducts }, null, 2));
  console.log('Vectorization complete. Saved to vectorized_data.json');
}

vectorizeImages();
