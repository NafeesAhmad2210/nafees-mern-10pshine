import { useState, useEffect } from 'react';
import { getNotes } from '../api.js';

function AllNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getNotes();
        if (!cancelled) setNotes(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load notes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">All Notes</h1>
      <p className="text-slate-400 mb-6">
        Every note you’ve created, newest first.
      </p>
      {loading && <p className="text-slate-400">Loading…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && notes.length === 0 && (
        <p className="text-slate-400">No notes yet. Create one from Create note.</p>
      )}
      {!loading && notes.length > 0 && (
        <ul className="space-y-3 max-w-2xl">
          {notes.map((note) => (
            <li
              key={note._id}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <h3 className="font-medium text-slate-100">{note.title}</h3>
              {note.content && (
                <p className="text-slate-400 text-sm mt-1 whitespace-pre-wrap">{note.content}</p>
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
  );
}

export default AllNotesPage;
