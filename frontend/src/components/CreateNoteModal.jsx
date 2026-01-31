import { useState } from 'react';

function CreateNoteModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    try {
      await onSave(title.trim(), content.trim(), important);
      setTitle('');
      setContent('');
      setImportant(false);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setImportant(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
      <div
        className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700/50 w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-slate-100 mb-4">New note</h2>
        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-900/30 rounded-lg py-2 px-3">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="note-title" className="block text-sm font-medium text-slate-300 mb-1">
              Title
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="note-content" className="block text-sm font-medium text-slate-300 mb-1">
              Content
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note content (optional)"
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="note-important"
              type="checkbox"
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="note-important" className="text-sm font-medium text-slate-300">
              Mark as important
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save note'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNoteModal;
