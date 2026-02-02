import { useState, useEffect } from 'react';
import { getTrashedNotes, restoreNote } from '../api.js';

export default function TrashPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTrashedNotes();
        if (!cancelled) setNotes(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load trash');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleRestore = async (id) => {
    try {
      await restoreNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to restore');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Trash</h1>
      <p className="text-slate-400 mb-6">Only notes you moved to trash appear here. Restore to move back to All Notes.</p>
      {loading && <p className="text-slate-400">Loading…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && notes.length === 0 && <p className="text-slate-400">No trashed notes. Click the trash icon on a note to move it here.</p>}
      {!loading && notes.length > 0 && (
        <ul className="space-y-3 max-w-2xl">
          {notes.map((note) => (
            <li key={note._id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-slate-100">{note.title}</h3>
                {note.content && <p className="text-slate-400 text-sm mt-1 line-clamp-2">{note.content}</p>}
              </div>
              <button type="button" onClick={() => handleRestore(note._id)} className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-slate-100 text-sm font-medium">Restore</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
