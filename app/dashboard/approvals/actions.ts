'use server';
// app/dashboard/approvals/actions.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function approveEntry(id: string, remarks: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  const user = session.user as any;
  if (user.role !== 'APPROVER' && user.role !== 'ADMIN') {
    throw new Error('Not authorized');
  }

  await prisma.inventoryEntry.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedById: user.id,
      approvedAt: new Date(),
      remarks: remarks || null,
    },
  });

  revalidatePath('/dashboard/approvals');
  revalidatePath('/dashboard/entries');
  revalidatePath('/dashboard');
}

export async function rejectEntry(id: string, remarks: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  const user = session.user as any;
  if (user.role !== 'APPROVER' && user.role !== 'ADMIN') {
    throw new Error('Not authorized');
  }

  if (!remarks.trim()) throw new Error('A reason is required when rejecting an entry');

  await prisma.inventoryEntry.update({
    where: { id },
    data: {
      status: 'REJECTED',
      approvedById: user.id,
      approvedAt: new Date(),
      remarks,
    },
  });

  revalidatePath('/dashboard/approvals');
  revalidatePath('/dashboard/entries');
  revalidatePath('/dashboard');
}
