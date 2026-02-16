import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getNotes, updateNote, trashNote } from "../api.js";
import NoteCard from "../components/NoteCard.jsx";
import EditNoteModal from "../components/EditNoteModal.jsx";

export default function AllNotesPage() {
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      const list = Array.isArray(data) ? data : data?.notes ?? [];
      setNotes(list.filter((n) => !n.trashed));
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/all-notes") fetchNotes();
  }, [location.pathname]);

  const idStr = (id) => (typeof id === "string" ? id : String(id));

  const handleToggleImportant = async (id, important) => {
    try {
      const updated = await updateNote(id, { important });
      setNotes((prev) =>
        prev.map((n) => (idStr(n._id) === idStr(id) ? { ...n, ...updated } : n))
      );
    } catch {
      // keep UI as is on error
    }
  };

  const handleTrash = async (id) => {
    try {
      await trashNote(id);
      setNotes((prev) => prev.filter((n) => idStr(n._id) !== idStr(id)));
    } catch {
      // keep UI as is on error
    }
  };

  const handleEditSave = async (id, title, content, important) => {
    try {
      const updated = await updateNote(id, { title, content, important });
      setNotes((prev) =>
        prev.map((n) => (idStr(n._id) === idStr(id) ? { ...n, ...updated } : n))
      );
      setEditingNote(null);
    } catch (e) {
      throw e;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">All notes</h1>
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="text-slate-400">No notes yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              showContentFull={false}
              onToggleImportant={handleToggleImportant}
              onTrash={handleTrash}
              onEdit={setEditingNote}
            />
          ))}
        </ul>
      )}
      <EditNoteModal
        isOpen={!!editingNote}
        note={editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleEditSave}
      />
    </div>
  );
}
