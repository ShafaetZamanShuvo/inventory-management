// app/dashboard/approvals/page.tsx
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ApprovalsList from './ApprovalsList';

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  // Only APPROVER and ADMIN can access
  if (user.role !== 'APPROVER' && user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const pending = await prisma.inventoryEntry.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' }, // oldest first — fairness
    include: {
      createdBy: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pending Approvals</h1>
        <p className="text-slate-500 text-sm mt-1">
          {pending.length === 0
            ? 'No entries waiting for approval.'
            : `${pending.length} ${pending.length === 1 ? 'entry' : 'entries'} waiting for your review.`}
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-semibold text-slate-700 mb-1">All caught up!</p>
          <p className="text-sm text-slate-400">No entries are waiting for approval right now.</p>
        </div>
      ) : (
        <ApprovalsList entries={pending} />
      )}
    </div>
  );
}
