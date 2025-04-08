import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./upload.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get my replicate token value 
// (I KNOW NOT TO SHARE THIS NORMALLY!)
// (this is just a demo for you guys though so i'm supplying it)
// (and i have a rate limitor set)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.REPLICATE_API_TOKEN) {
  console.warn("Missing REPLICATE_API_TOKEN in .env");
}

// running on port 5050 because on mac, port 5000 (default) is used for something
const app = express();
const PORT = 5050;

app.use(cors());
app.use(fileUpload());
app.use(express.json());


// mount upload route
app.use("/api/upload", uploadRoute);

app.get("/", (req, res) => {
  res.send("Server is up");
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});




