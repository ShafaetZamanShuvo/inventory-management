import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as any;

    const { id } = await params;

    const existing = await prisma.inventoryEntry.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Entry not found' },
        { status: 404 }
      );
    }

    // owner only
    if (existing.createdById !== user.id) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // pending only
    if (existing.status !== 'PENDING') {
      return NextResponse.json(
        {
          message:
            'Approved or rejected entries cannot be edited',
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updated = await prisma.inventoryEntry.update({
      where: {
        id,
      },

      data: {
        productName: body.productName,
        quantity: Number(body.quantity),
        issuedBy: body.issuedBy,
        reason: body.reason,
        description: body.description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}