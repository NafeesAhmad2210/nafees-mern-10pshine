import { useState, useEffect } from 'react';
import CreateNoteModal from '../components/CreateNoteModal.jsx';
import { getNotes, createNote } from '../api.js';

function CreateNotePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSaveNote = async (title, content, important) => {
    await createNote(title, content, important);
    await loadNotes();
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

        <h2 className="text-lg font-semibold text-slate-200 mb-3">3 most recent notes</h2>
        {loading && <p className="text-slate-400">Loading…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && recentNotes.length === 0 && (
          <p className="text-slate-400">No notes yet. Create one above.</p>
        )}
        {!loading && recentNotes.length > 0 && (
          <ul className="space-y-3">
            {recentNotes.map((note) => (
              <li
                key={note._id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <h3 className="font-medium text-slate-100">{note.title}</h3>
                {note.content && (
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{note.content}</p>
                )}
                {note.important && (
                  <span className="inline-block mt-2 text-xs text-amber-400 font-medium">
                    Important
                  </span>
                )}
              </li>
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

export default CreateNotePage;
