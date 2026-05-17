export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import EditEntryForm from './EditEntryForm';

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  const user = session?.user as any;

  const entry = await prisma.inventoryEntry.findUnique({
    where: {
      id,
    },
  });

  if (!entry) {
    notFound();
  }

  // only owner can edit
  if (entry.createdById !== user.id) {
    redirect('/dashboard/entries');
  }

  // only pending editable
  if (entry.status !== 'PENDING') {
    redirect('/dashboard/entries');
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">
          Edit Inventory Entry
        </h1>

        <EditEntryForm entry={entry} />
      </div>
    </div>
  );
}