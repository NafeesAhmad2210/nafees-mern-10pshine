import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateNoteModal from "../components/CreateNoteModal.jsx";
import NoteCard from "../components/NoteCard.jsx";
import { getNotes, createNote, updateNote, trashNote } from "../api.js";

export default function CreateNotePage() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/create-note") loadNotes();
  }, [location.pathname]);

  const handleSaveNote = async (title, content, important) => {
    await createNote(title, content, important);
    await loadNotes();
  };

  const handleToggleImportant = async (id, important) => {
    try {
      await updateNote(id, { important });
      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to update");
    }
  };

  const handleTrash = async (id) => {
    try {
      await trashNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.message || "Failed to move to trash");
    }
  };

  const recentNotes = notes.slice(0, 3);

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Create note</h1>
        <p className="text-slate-400 mb-6">
          Add a new note. Notes are saved to your account.
        </p>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium mb-6"
        >
          New note
        </button>
        <h2 className="text-lg font-semibold text-slate-200 mb-3">
          3 most recent notes
        </h2>
        {loading && <p className="text-slate-400">Loading…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && recentNotes.length === 0 && (
          <p className="text-slate-400">No notes yet. Create one above.</p>
        )}
        {!loading && recentNotes.length > 0 && (
          <ul className="space-y-3">
            {recentNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onToggleImportant={handleToggleImportant}
                onTrash={handleTrash}
              />
            ))}
          </ul>
        )}
      </div>
      <CreateNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}
