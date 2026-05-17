'use server';
// app/dashboard/new-entry/actions.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEntry(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  const user = session.user as any;

  const productName = formData.get('productName') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as 'IN' | 'OUT';
  const quantity = parseFloat(formData.get('quantity') as string);
  const unit = formData.get('unit') as string;
  const issuedBy = formData.get('issuedBy') as string;
  const reason = formData.get('reason') as string;
  const date = new Date(formData.get('date') as string);

  if (!productName || !type || !quantity || !unit || !issuedBy || !reason || !date) {
    throw new Error('All required fields must be filled');
  }

  await prisma.inventoryEntry.create({
    data: {
      productName,
      description: description || null,
      type,
      quantity,
      unit,
      issuedBy,
      reason,
      date,
      status: 'PENDING',
      createdById: user.id,
    },
  });

  revalidatePath('/dashboard/entries');
  revalidatePath('/dashboard');
  redirect('/dashboard/entries');
}
