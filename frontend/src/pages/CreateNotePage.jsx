import { useState, useEffect } from "react";
import { getNotes, createNote } from "../api.js";
import EditNoteModal from "../components/EditNoteModal.jsx";
import NoteCard from "../components/NoteCard.jsx";

export default function CreateNotePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      const list = Array.isArray(data) ? data : data?.notes ?? [];
      setNotes(list.filter((n) => !n.trashed).slice(0, 3));
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async (title, content, important) => {
    await createNote(title, content, important);
    await fetchNotes();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Create note</h1>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium"
        >
          + New note
        </button>
      </div>
      <h2 className="text-lg font-semibold text-slate-200 mb-3">Recent notes</h2>
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="text-slate-400">No notes yet. Create one above.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} showContentFull={false} />
          ))}
        </ul>
      )}
      <EditNoteModal
        isOpen={modalOpen}
        note={null}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
