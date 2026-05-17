'use client';

import Link from 'next/link';
import { useState } from 'react';

type Entry = {
  id: string;
  createdById: string;

  date: Date;
  type: 'IN' | 'OUT';
  productName: string;
  description: string | null;
  quantity: number;
  unit: string;
  issuedBy: string;
  reason: string;

  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  remarks: string | null;

  createdBy: {
    name: string;
  };

  approvedBy: {
    name: string;
  } | null;

  approvedAt: Date | null;
  createdAt: Date;
};

export default function EntriesTable({
  entries,
  userRole,
  userId,
}: {
  entries: Entry[];
  userRole: string;
  userId: string;
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const [filterStatus, setFilterStatus] = useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('ALL');

  const [selected, setSelected] = useState<Entry | null>(null);

  const filtered = entries.filter((e) => {
    const matchSearch =
      e.productName.toLowerCase().includes(search.toLowerCase()) ||
      e.issuedBy.toLowerCase().includes(search.toLowerCase()) ||
      e.reason.toLowerCase().includes(search.toLowerCase());

    const matchType = filterType === 'ALL' || e.type === filterType;

    const matchStatus =
      filterStatus === 'ALL' || e.status === filterStatus;

    return matchSearch && matchType && matchStatus;
  });

  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <>
      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search product, issuer, reason..."
          className="input-field flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input-field sm:w-36"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="ALL">All Types</option>
          <option value="IN">IN only</option>
          <option value="OUT">OUT only</option>
        </select>

        <select
          className="input-field sm:w-40"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="card overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Issued By</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Entry By</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    No entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {fmt(entry.date)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          entry.type === 'IN'
                            ? 'badge-in'
                            : 'badge-out'
                        }
                      >
                        {entry.type === 'IN' ? '↑ IN' : '↓ OUT'}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {entry.productName}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {entry.quantity} {entry.unit}
                    </td>

                    <td className="px-4 py-3">{entry.issuedBy}</td>

                    <td className="px-4 py-3">{entry.reason}</td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          entry.status === 'APPROVED'
                            ? 'badge-approved'
                            : entry.status === 'REJECTED'
                            ? 'badge-rejected'
                            : 'badge-pending'
                        }
                      >
                        {entry.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {entry.createdBy.name}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelected(entry)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          View
                        </button>

                        {entry.status === 'PENDING' &&
                          entry.createdById === userId && (
                            <Link
                              href={`/dashboard/entries/${entry.id}/edit`}
                              className="text-amber-600 hover:text-amber-800 text-xs font-medium"
                            >
                              Edit
                            </Link>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {filtered.map((entry) => (
          <div key={entry.id} className="card p-4 space-y-2">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span
                  className={
                    entry.type === 'IN'
                      ? 'badge-in'
                      : 'badge-out'
                  }
                >
                  {entry.type === 'IN' ? '↑ IN' : '↓ OUT'}
                </span>

                <span
                  className={
                    entry.status === 'APPROVED'
                      ? 'badge-approved'
                      : entry.status === 'REJECTED'
                      ? 'badge-rejected'
                      : 'badge-pending'
                  }
                >
                  {entry.status}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(entry)}
                  className="text-blue-600 text-xs font-medium"
                >
                  View
                </button>

                {entry.status === 'PENDING' &&
                  entry.createdById === userId && (
                    <Link
                      href={`/dashboard/entries/${entry.id}/edit`}
                      className="text-amber-600 text-xs font-medium"
                    >
                      Edit
                    </Link>
                  )}
              </div>
            </div>

            <p className="font-semibold">{entry.productName}</p>

            <div className="text-xs text-slate-500">
              <p>
                Qty: {entry.quantity} {entry.unit}
              </p>

              <p>Issued by: {entry.issuedBy}</p>

              <p>Reason: {entry.reason}</p>

              <p>Date: {fmt(entry.date)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-lg">
                Entry Details
              </h2>

              <button onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <Detail
                label="Product"
                value={selected.productName}
              />

              <Detail
                label="Quantity"
                value={`${selected.quantity} ${selected.unit}`}
              />

              <Detail
                label="Issued By"
                value={selected.issuedBy}
              />

              <Detail
                label="Reason"
                value={selected.reason}
              />

              <Detail
                label="Status"
                value={selected.status}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase">
        {label}
      </p>

      <p className="text-slate-800">{value}</p>
    </div>
  );
}