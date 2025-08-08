import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { listCaseNotes } from "../services/caseNotesService";
import UploadModal from "../components/UploadModal";
import CaseNoteCard from "../components/CaseNoteCard";
import { beautifyOCRText } from "../utils/ocr";
// Removed broken import for Route type

// Removed meta export due to missing Route type

type CaseNote = {
  _id: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
};

const Home = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<CaseNote | null>(null);

  const fetchNotes = async () => {
    try {
      if (!token) return;
      const data = await listCaseNotes(token);
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  return (
    <div className="max-w-[1920px] mx-auto p-5 md:p-10 relative">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">All Case Notes</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-white text-[#008b8b] font-bold border text-sm md:text-lg hover:bg-[#008b8b] hover:text-white hover:border-white  px-4 py-2 rounded-sm cursor-pointer"
        >
          &#43; Upload Note
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No case notes found.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note._id} onClick={() => setSelectedNote(note)}>
              <CaseNoteCard note={note} />
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            fetchNotes();
            setShowUploadModal(false);
          }}
        />
      )}

      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white max-w-lg w-full h-fit max-h-[90dvh] overflow-auto p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-6 text-gray-600 hover:text-black text-3xl cursor-pointer"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">Case Note</h2>
            <div className="flex flex-col">
              {selectedNote.imageUrl && (
                <img
                  src={selectedNote.imageUrl}
                  alt="Uploaded"
                  className="w-full h-auto mb-4 border-b border-gray-300 pb-4"
                />
              )}

              {selectedNote.imageUrl &&
                <span className="text-xl font-semibold block mb-3"> OCR - </span>}
              <pre className="whitespace-pre-wrap text-gray-800 bg-gray-100 rounded-md p-3 border leading-relaxed text-sm">
                {selectedNote.notes ? beautifyOCRText(selectedNote.notes) : "No content available"}
              </pre>

              <div className="text-lg text-gray-500 mt-4">
                <p>
                  Submitted on:
                </p>
                <span> {new Date(selectedNote.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Home
