import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./upload.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.REPLICATE_API_TOKEN) {
  console.warn("Missing REPLICATE_API_TOKEN in .env");
}

const app = express();
const PORT = 5050;

app.use(cors());
app.use(fileUpload());
app.use(express.json());


// Mount upload route
app.use("/api/upload", uploadRoute);

app.get("/", (req, res) => {
  res.send("👋 Server is alive!");
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});




