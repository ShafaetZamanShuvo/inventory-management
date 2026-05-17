'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { NextResponse } from 'next/server';

export async function PATCH() {
  return NextResponse.json({
    success: true,
  });
}

export default function EditEntryForm({
  entry,
}: {
  entry: any;
}) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    productName: entry.productName,
    quantity: entry.quantity,
    issuedBy: entry.issuedBy,
    reason: entry.reason,
    description: entry.description || '',
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch(
        `/dashboard/entries/${entry.id}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        router.push('/dashboard/entries');
        router.refresh();
      } else {
        alert('Failed to update entry');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-1 text-sm font-medium">
          Product Name
        </label>

        <input
          type="text"
          className="input-field w-full"
          value={form.productName}
          onChange={(e) =>
            setForm({
              ...form,
              productName: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Quantity
        </label>

        <input
          type="number"
          className="input-field w-full"
          value={form.quantity}
          onChange={(e) =>
            setForm({
              ...form,
              quantity: Number(e.target.value),
            })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Issued By
        </label>

        <input
          type="text"
          className="input-field w-full"
          value={form.issuedBy}
          onChange={(e) =>
            setForm({
              ...form,
              issuedBy: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Reason
        </label>

        <textarea
          className="input-field w-full"
          value={form.reason}
          onChange={(e) =>
            setForm({
              ...form,
              reason: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Description
        </label>

        <textarea
          className="input-field w-full"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? 'Updating...' : 'Update Entry'}
      </button>
    </form>
  );
}