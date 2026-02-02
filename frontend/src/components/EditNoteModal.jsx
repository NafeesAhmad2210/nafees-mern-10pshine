import { useState, useEffect } from 'react';

export default function EditNoteModal({ isOpen, note, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setImportant(Boolean(note.important));
      setError('');
    }
  }, [note, isOpen]);

  if (!isOpen || !note) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    try {
      await onSave(String(note._id), title.trim(), (content || '').trim(), important);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
      <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700/50 w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Edit note</h2>
        {error && <p className="text-red-400 text-sm mb-4 bg-red-900/30 rounded-lg py-2 px-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-note-title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input
              id="edit-note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="edit-note-content" className="block text-sm font-medium text-slate-300 mb-1">Content</label>
            <textarea
              id="edit-note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note content (optional)"
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setImportant(!important)} className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-500" title={important ? 'Important' : 'Mark as important'}>
              {important ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-slate-400 hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              )}
            </button>
            <span className="text-sm font-medium text-slate-300">Mark as important</span>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium disabled:opacity-60">{loading ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-slate-100">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
