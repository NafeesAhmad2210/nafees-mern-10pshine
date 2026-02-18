import { Link, Outlet } from "react-router-dom";

export default function SidebarLayout() {
  return (
    <div className="min-h-screen flex bg-slate-900">
      <aside className="w-56 shrink-0 border-r border-slate-700/50 bg-slate-800/30 flex flex-col">
        <Link
          to="/create-note"
          className="p-4 border-b border-slate-700/50 flex items-center gap-3 hover:bg-slate-700/20 transition"
        >
          <span className="text-xl font-bold text-amber-400">My Notes</span>
        </Link>
        <nav className="p-2 flex flex-col gap-1">
          <Link
            to="/create-note"
            className="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/30 hover:text-slate-100 transition font-medium flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create note
          </Link>
          <Link
            to="/all-notes"
            className="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/30 hover:text-slate-100 transition font-medium flex items-center gap-2"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            All Notes
          </Link>
          <Link
            to="/important"
            className="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/30 hover:text-slate-100 transition font-medium flex items-center gap-2"
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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            Important
          </Link>
          <Link
            to="/trash"
            className="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/30 hover:text-slate-100 transition font-medium flex items-center gap-2"
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
            Trash
          </Link>
        </nav>
        <div className="mt-auto p-2 border-t border-slate-700/50">
          <Link
            to="/profile"
            className="w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/30 hover:text-slate-100 transition font-medium flex items-center gap-2"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
