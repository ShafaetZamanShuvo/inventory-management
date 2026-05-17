// app/dashboard/entries/page.tsx
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import EntriesTable from './EntriesTable';

export default async function EntriesPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  const entries = await prisma.inventoryEntry.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { name: true } },
      approvedBy: { select: { name: true } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inventory Entries</h1>
          <p className="text-slate-500 text-sm mt-1">{entries.length} total entries</p>
        </div>
        <a
          href="/dashboard/new-entry"
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New Entry</span>
          <span className="sm:hidden">New</span>
        </a>
      </div>

      <EntriesTable entries={entries} userRole={user.role} userId={user.id} />
    </div>
  );
}
