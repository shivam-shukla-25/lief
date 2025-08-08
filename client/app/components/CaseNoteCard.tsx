import { beautifyOCRText } from "../utils/ocr";

type CaseNote = {
  _id: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
};

const CaseNoteCard: React.FC<{ note: CaseNote }> = ({ note }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg hover:shadow-md transition cursor-pointer h-full">
      {note.imageUrl ? (
        <img
          src={note.imageUrl}
          alt="Case Note"
          className="w-full h-60 object-cover object-left-top rounded"
        />
      ) : (
        <pre className="text-lg text-gray-800 font-medium whitespace-pre-wrap line-clamp-4 p-4 bg-gray-100 h-full">
          {note.notes ? beautifyOCRText(note.notes) : "No content available"}
        </pre>
      )}
      <div className="text-lg text-gray-600 p-4 mt-auto">
        <p className="mt-2">
          Submitted on:
        </p>
        <span> {new Date(note.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default CaseNoteCard;
