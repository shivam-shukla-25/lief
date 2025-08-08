import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import caseNoteRoutes from "./routes/caseNote.routes.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware } from "./middleware/auth.middleware.js";


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health check route
app.get("/health-check", (req, res) => {
	res.status(200).json({ status: "ok" });
});


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/auth", authRoutes);
app.use("/case-notes", authMiddleware, caseNoteRoutes);

export default app;