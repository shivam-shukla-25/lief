import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICaseNote extends Document {
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  userId: Types.ObjectId;
}

const CaseNoteSchema = new Schema<ICaseNote>(
  {
    notes: { type: String },
    imageUrl: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ICaseNote>("CaseNote", CaseNoteSchema);
