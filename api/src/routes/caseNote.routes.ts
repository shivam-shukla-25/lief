import express from "express";
import multer from "multer";
import { uploadImageNote, uploadTextNote, listNotes } from "../controllers/caseNote.controller.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-image", upload.single("image"), uploadImageNote);
router.post("/upload-text", uploadTextNote);
router.get("/", listNotes);

export default router;