'use client';
// components/TopBar.tsx
import { signOut } from 'next-auth/react';

type User = {
  name?: string | null;
  email?: string | null;
  role?: string;
};

export default function TopBar({
  user,
  onMenuClick,
}: {
  user: User;
  onMenuClick?: () => void;
}) {
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    APPROVER: 'bg-green-100 text-green-700',
    ENTRY_CLERK: 'bg-blue-100 text-blue-700',
  };

  const roleLabel: Record<string, string> = {
    ADMIN: 'Admin',
    APPROVER: 'Approver',
    ENTRY_CLERK: 'Entry Clerk',
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 -ml-1"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Spacer on desktop */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={`hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[user.role || 'ENTRY_CLERK']}`}>
          {roleLabel[user.role || 'ENTRY_CLERK']}
        </span>

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-none">{user.name}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">{user.email}</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="ml-1 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Sign out"
          aria-label="Sign out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
