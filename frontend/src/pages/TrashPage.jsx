import { useState, useEffect } from "react";
import { getTrashedNotes, restoreNote, deleteNotePermanent } from "../api.js";

export default function TrashPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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
    } catch (err) {
      setError(err?.message || "Failed to restore note");
    }
  };

  const handleDeletePermanent = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this note? This action cannot be undone.")) {
      return;
    }
    setError("");
    setDeletingId(id);
    try {
      await deleteNotePermanent(id);
      setNotes((prev) => prev.filter((n) => idStr(n._id) !== idStr(id)));
    } catch (err) {
      setError(err?.message || "Failed to delete note. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Trash</h1>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-200 text-sm">
          {error}
        </div>
      )}
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
              <div className="absolute top-3 right-3 flex flex-col gap-1 items-stretch bg-slate-900/70 rounded-lg p-1.5 shadow-sm border border-slate-700/50">
                <button
                  type="button"
                  onClick={() => handleRestore(note._id)}
                  className="px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-xs transition-colors"
                >
                  Restore
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePermanent(note._id)}
                  disabled={deletingId === idStr(note._id)}
                  className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs transition-colors"
                >
                  {deletingId === idStr(note._id) ? "Deleting..." : "Remove"}
                </button>
              </div>
              <h3 className="font-medium text-slate-100 pr-28">{note.title}</h3>
              {note.content && (
                <div
                  className="rich-editor text-slate-400 text-sm mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
