// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  const [totalIn, totalOut, pending, recentEntries] = await Promise.all([
    prisma.inventoryEntry.count({ where: { type: 'IN', status: 'APPROVED' } }),
    prisma.inventoryEntry.count({ where: { type: 'OUT', status: 'APPROVED' } }),
    prisma.inventoryEntry.count({ where: { status: 'PENDING' } }),
    prisma.inventoryEntry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { name: true } } },
    }),
  ]);

  const stats = [
    {
      label: 'Items In (Approved)',
      value: totalIn,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
    },
    {
      label: 'Items Out (Approved)',
      value: totalOut,
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-orange-700',
      icon: (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
    },
    {
      label: 'Pending Approval',
      value: pending,
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-700',
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'badge-pending',
      APPROVED: 'badge-approved',
      REJECTED: 'badge-rejected',
    };
    return map[status] || 'badge-pending';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Welcome back, {user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`card border p-4 sm:p-5 ${stat.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {stat.icon}
              </div>
            </div>
            <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={`rounded-lg px-4 py-3 text-sm border flex items-start gap-2 ${
        user.role === 'ENTRY_CLERK'
          ? 'bg-blue-50 border-blue-200 text-blue-700'
          : user.role === 'APPROVER'
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-purple-50 border-purple-200 text-purple-700'
      }`}>
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>
          {user.role === 'ENTRY_CLERK' && 'You are an Entry Clerk — you can create inventory entries. They will be reviewed by an Approver.'}
          {user.role === 'APPROVER' && 'You are an Approver — you can create entries and approve or reject pending entries.'}
          {user.role === 'ADMIN' && 'You are an Admin — you have full access to all features, users, and reports.'}
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Entries</h2>
          <a href="/dashboard/entries" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all →
          </a>
        </div>
        {recentEntries.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-400 text-sm">
            No entries yet. Start by adding an inventory entry.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                <span className={entry.type === 'IN' ? 'badge-in' : 'badge-out'}>
                  {entry.type === 'IN' ? '↑ IN' : '↓ OUT'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{entry.productName}</p>
                  <p className="text-xs text-slate-400 truncate">
                    by {entry.createdBy.name} · {entry.quantity} {entry.unit}
                  </p>
                </div>
                <span className={statusBadge(entry.status)}>{entry.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
