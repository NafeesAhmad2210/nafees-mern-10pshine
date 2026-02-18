import { useState, useEffect } from "react";
import { getTrashedNotes, restoreNote } from "../api.js";
import NoteCard from "../components/NoteCard.jsx";

export default function TrashPage() {
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getTrashedNotes();
      const list = Array.isArray(data) ? data : (data?.notes ?? []);
      setNotes(list);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const idStr = (id) => (typeof id === "string" ? id : String(id));

  const handleRestore = async (id) => {
    setError("");
    try {
      await restoreNote(id);
      setNotes((prev) => prev.filter((n) => idStr(n._id) !== idStr(id)));
    } catch {
      // keep UI as is on error
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Trash</h1>
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="text-slate-400">Trash is empty.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <li
              key={note._id}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 relative"
            >
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => handleRestore(note._id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm"
                >
                  Restore
                </button>
              </div>
              <h3 className="font-medium text-slate-100 pr-24">{note.title}</h3>
              {note.content && (
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                  {note.content}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
