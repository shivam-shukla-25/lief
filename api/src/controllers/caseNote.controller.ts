import { Request, Response } from "express";
import streamifier from "streamifier";
import CaseNote from "../models/caseNote.model.js";
import { beautifyOCRText, performOCR } from "../utils/ocr.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import cloudinary from "../config/cloudinary.js";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const uploadImageNote = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Log file size/type for debugging
    console.log("Uploading file:", file.originalname, "Size:", file.size, "Type:", file.mimetype);

    // Set a timeout for Cloudinary upload (e.g., 30 seconds)
    const cloudinaryResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Cloudinary upload timeout")), 30000);
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "case_notes" },
        (error, result) => {
          clearTimeout(timeout);
          if (error) return reject(error);
          resolve(result as { secure_url: string });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    const rawText = await performOCR(cloudinaryResult.secure_url);
    const cleanedText = beautifyOCRText(rawText);

    const note = await CaseNote.create({
      notes: cleanedText,
      imageUrl: cloudinaryResult.secure_url,
      userId: req.user?.id,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ message: "Failed to upload image note", error: err });
  }
};

export const uploadTextNote = async (req: AuthRequest, res: Response) => {
  try {
    const { notes } = req.body;
    if (!notes) return res.status(400).json({ message: "Note text is required" });

    const note = await CaseNote.create({
      notes,
      userId: req.user?.id,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload text note" });
  }
};

export const listNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notes = await CaseNote.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

