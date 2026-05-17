// app/dashboard/entries/page.tsx

export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import Link from 'next/link';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import EntriesTable from './EntriesTable';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function EntriesPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  const params = await searchParams;

  const currentPage = Number(params.page || 1);
  const limit = 10;

  const skip = (currentPage - 1) * limit;

 const [entries, totalEntries] = await Promise.all([
  prisma.inventoryEntry.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: {
      createdBy: { select: { name: true } },
      approvedBy: { select: { name: true } },
    },
  }),

  prisma.inventoryEntry.count(),
]);

  const totalPages = Math.ceil(totalEntries / limit);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Inventory Entries
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            {totalEntries} total entries
          </p>
        </div>

        <Link
          href="/dashboard/new-entry"
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <svg
            className="w-4 h-4"
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

          <span className="hidden sm:inline">New Entry</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      <EntriesTable
        entries={entries}
        userRole={user.role}
        userId={user.id}
      />

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Link
          href={`/dashboard/entries?page=${currentPage - 1}`}
          className={`px-4 py-2 rounded border text-sm ${
            currentPage <= 1
              ? 'pointer-events-none opacity-50'
              : 'hover:bg-slate-100'
          }`}
        >
          Previous
        </Link>

        <span className="text-sm text-slate-600">
          Page {currentPage} of {totalPages}
        </span>

        <Link
          href={`/dashboard/entries?page=${currentPage + 1}`}
          className={`px-4 py-2 rounded border text-sm ${
            currentPage >= totalPages
              ? 'pointer-events-none opacity-50'
              : 'hover:bg-slate-100'
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}