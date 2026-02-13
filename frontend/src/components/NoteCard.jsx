export default function NoteCard({
  note,
  onToggleImportant,
  onTrash,
  onEdit,
  showContentFull,
}) {
  return (
    <li className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 relative">
      <div className="absolute top-3 right-3 flex items-center gap-1">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(note);
            }}
            className="p-1.5 rounded text-slate-400 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            title="Edit note"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
        {onToggleImportant && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant(note._id, !note.important);
            }}
            className="p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            title={note.important ? "Important" : "Mark as important"}
          >
            {note.important ? (
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-slate-400 hover:text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            )}
          </button>
        )}
        {onTrash && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTrash?.(note._id);
            }}
            className="p-1.5 rounded text-slate-400 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Move to trash"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
      <h3 className="font-medium text-slate-100 pr-24">{note.title}</h3>
      {note.content && (
        <div
          className={`rich-editor text-slate-400 text-sm mt-1 ${
            showContentFull ? "" : "line-clamp-2"
          }`}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      )}
      {note.important && !showContentFull && (
        <span className="inline-block mt-2 text-xs text-amber-400 font-medium">
          Important
        </span>
      )}
    </li>
  );
}
