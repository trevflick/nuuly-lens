// this file is for vectorizing the database items
// i'm keeping it in here to show how i did this,
// but it doesnt get used when you run the server
// (can be used again if i want to make the database bigger though)
import fs from "fs";
import path from "path";
import Replicate from "replicate";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get replicate token from root
const rootDir = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(rootDir, ".env") });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// input data contains path to github hosted photos
const inputPath = path.join(__dirname, "goodData.json");
const outputPath = path.join(__dirname, "revectorized_nuuly_data.json");

const raw = fs.readFileSync(inputPath);
const parsed = JSON.parse(raw);
const { products } = parsed;

async function vectorizeAll() {
  const vectorized = [];

  // go through file, vectorize each image
  for (const product of products) {
    const { image, displayName } = product;
    if (!image) continue;

    console.log(`Vectorizing: ${displayName}`);

    try {
      const output = await replicate.run(
        "andreasjansson/clip-features:75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
        {
          // this part was difficult to fix. i had to play around with the input
          // because it tried vectorizing the photo + the description (which i didn't want)
          input: {
            inputs: image // this is the direct GitHub image URL
          },
        }
      );

      // extract the embedding from the output
      const embedding = Array.isArray(output)
        ? output[0]?.embedding || output[1]?.embedding
        : output?.embedding;

      if (!embedding || !Array.isArray(embedding)) {
        console.warn("No valid embedding for", displayName);
        continue;
      }

      // store the new vectorized product
      vectorized.push({
        ...product,
        vector: [{ embedding }],
      });
    } catch (err) {
      console.error("Error vectorizing", displayName, err);
    }
  }
  // save the vectorized dataset to a new JSON file
  fs.writeFileSync(outputPath, JSON.stringify({ products: vectorized }, null, 2));
  console.log(`Saved ${vectorized.length} vectorized products to ${outputPath}`);
}
// run the vectorization script
vectorizeAll();
