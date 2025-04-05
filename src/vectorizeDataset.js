// this file is vectorizing my 36 sample images.
// the nuuly site prohibited me from pulling the photos directly (i tried in docker)
// if it DIDNT, i'd have the whole nuuly catalog vectorized for like 4 dollars.
// so if you're a dev reading this,,,it'll only cost 4 dollars to get this running 
// using this specific clip model.
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const CLIP_VERSION = '75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a';
const INPUT_JSON = './src/data_with_local_images.json';
const OUTPUT_JSON = './src/vectorized_data.json';

async function waitForPrediction(predictionUrl) {
  while (true) {
    const pollRes = await fetch(predictionUrl, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const prediction = await pollRes.json();

    if (prediction.status === 'succeeded') return prediction.output;
    if (prediction.status === 'failed') return null;
    // wait a second before trying again
    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function vectorizeImage(base64Image) {
  let retryAttempts = 0;
  while (retryAttempts < 5) {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: CLIP_VERSION,
        input: {
          image: `data:image/jpeg;base64,${base64Image}`
        }
      })
    });

    const result = await response.json();

    if (response.status === 429 && result.retry_after) {
      const waitTime = result.retry_after * 1000;
      console.warn(`⏳ Rate limited. Retrying in ${result.retry_after} seconds...`);
      await new Promise((res) => setTimeout(res, waitTime));
      retryAttempts++;
      continue;
    }

    if (!response.ok || !result.urls || !result.urls.get) {
      console.error('Replicate error:', result);
      return null;
    }

    return await waitForPrediction(result.urls.get);
  }

  console.error('Failed after multiple retries.');
  return null;
}

async function run() {
  const rawData = fs.readFileSync(INPUT_JSON, 'utf-8');
  const data = JSON.parse(rawData);
  const updatedProducts = [];

  for (const [index, product] of data.products.entries()) {
    try {
      const imagePath = path.resolve('./src', product.image);
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const vector = await vectorizeImage(base64Image);

      if (vector) {
        console.log(`[${index + 1}/${data.products.length}] Vectorized: ${product.image}`);
      } else {
        console.warn(`[${index + 1}/${data.products.length}] No vector returned for: ${product.image}`);
      }

      updatedProducts.push({ ...product, vector });
    } catch (err) {
      console.error(`Failed to process ${product.image}:`, err.message);
      updatedProducts.push({ ...product, vector: null });
    }
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify({ products: updatedProducts }, null, 2));
  console.log(`Done and Saved to ${OUTPUT_JSON}`);
}

run();
