import { useState, useEffect } from 'react';
import NoteCard from '../components/NoteCard.jsx';
import EditNoteModal from '../components/EditNoteModal.jsx';
import { getImportantNotes, updateNote, trashNote } from '../api.js';

export default function ImportantPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getImportantNotes();
        if (!cancelled) setNotes(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load notes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleToggleImportant = async (id, important) => {
    await updateNote(id, { important });
    if (!important) setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const handleTrash = async (id) => {
    await trashNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const handleSaveEdit = async (id, title, content, important) => {
    try {
      const updated = await updateNote(id, { title, content, important });
      const idStr = String(id);
      setNotes((prev) => {
        if (!important) return prev.filter((n) => String(n._id) !== idStr);
        return prev.map((n) => (String(n._id) === idStr ? { ...n, title: updated.title, content: updated.content ?? '', important: Boolean(updated.important) } : n));
      });
      setEditingNote(null);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Important</h1>
      <p className="text-slate-400 mb-6">All notes marked as important.</p>
      {loading && <p className="text-slate-400">Loading…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && notes.length === 0 && <p className="text-slate-400">No important notes yet. Mark a note as important when creating it.</p>}
      {!loading && notes.length > 0 && (
        <ul className="space-y-3 max-w-2xl">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onEdit={setEditingNote} onToggleImportant={handleToggleImportant} onTrash={handleTrash} showContentFull />
          ))}
        </ul>
      )}
      <EditNoteModal isOpen={!!editingNote} note={editingNote} onClose={() => setEditingNote(null)} onSave={handleSaveEdit} />
    </div>
  );
}
