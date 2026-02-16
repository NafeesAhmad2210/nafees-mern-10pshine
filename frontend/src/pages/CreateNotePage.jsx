import { useState } from 'react';
import CreateNoteModal from '../components/CreateNoteModal.jsx';

function CreateNotePage() {
  const [modalOpen, setModalOpen] = useState(false);

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
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium"
        >
          New note
        </button>
      </div>
      <CreateNoteModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">New note</h2>
        <p className="text-slate-400 text-sm mb-4">
          Note creation UI can be extended here (title, body, save).
        </p>
        <button
          type="button"
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-slate-100"
        >
          Close
        </button>
      </CreateNoteModal>
    </div>
  );
}

export default CreateNotePage;
