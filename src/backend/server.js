import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./upload.js";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const PORT = 5050;

// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.json());

// Mount upload route
app.use("/api/upload", uploadRoute);

app.get("/", (req, res) => {
  res.send("👋 Server is alive!");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
