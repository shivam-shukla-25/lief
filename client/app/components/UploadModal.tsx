import { useState } from "react";
import { uploadImage, uploadText } from "../services/caseNotesService";
import { useAuth } from "../context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<"image" | "notes" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caseNotes, setCaseNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const reset = () => {
    setMode(null);
    setSelectedFile(null);
    setCaseNotes("");
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mode) return;
    if (!token) {
      alert("You must be logged in to upload notes.");
      return;
    }
    try {
      setLoading(true);
      if (mode === "image" && selectedFile) {
        await uploadImage(selectedFile, token);
      } else if (mode === "notes" && caseNotes.trim()) {
        await uploadText(caseNotes.trim(), token);
      } else {
        return alert("Please provide valid input.");
      }
      onSuccess();
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="flex flex-col gap-4 bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative min-h-48">
        <button
          onClick={() => {
            reset();
            onClose();
          }}
          className="absolute top-4 right-6 text-gray-600 hover:text-black text-3xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Upload Case Notes</h2>

        {!mode && (
          <div className="flex justify-center gap-4 mt-auto">
            <button
              onClick={() => setMode("image")}
              className="border border-[#008b8b] text-base font-semibold text-[#008b8b] px-6 py-2.5 rounded-lg flex-1 cursor-pointer hover:bg-[#008b8b] hover:text-white"
            >
              Upload Image
            </button>
            <button
              onClick={() => setMode("notes")}
              className="bg-[#008b8b] text-base font-semibold text-white px-6 py-2.5 rounded-lg flex-1 cursor-pointer hover:bg-[#008b8b]/80"
            >
              Write Notes
            </button>
          </div>
        )}

        {mode && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {mode === "image" && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="block w-full border rounded p-2 cursor-pointer"
              />
            )}

            {mode === "notes" && (
              <textarea
                rows={5}
                className="w-full border rounded p-2 focus:outline-none focus:border-[#008b8b]"
                placeholder="Write your notes..."
                value={caseNotes}
                onChange={(e) => setCaseNotes(e.target.value)}
              />
            )}

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={reset}
                className="text-sm text-gray-600 underline cursor-pointer"
              >
                Change Input Type
              </button>
              <button
                type="submit"
                className="bg-[#008b8b] text-base font-semibold text-white px-6 py-2.5 rounded-lg cursor-pointer hover:bg-[#008b8b]/80"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
