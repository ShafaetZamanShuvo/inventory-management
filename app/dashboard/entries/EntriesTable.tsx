'use client';
// app/dashboard/entries/EntriesTable.tsx
import { useState } from 'react';

type Entry = {
  id: string;
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
  createdBy: { name: string };
  approvedBy: { name: string } | null;
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
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [selected, setSelected] = useState<Entry | null>(null);

  const filtered = entries.filter((e) => {
    const matchSearch =
      e.productName.toLowerCase().includes(search.toLowerCase()) ||
      e.issuedBy.toLowerCase().includes(search.toLowerCase()) ||
      e.reason.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || e.type === filterType;
    const matchStatus = filterStatus === 'ALL' || e.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

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

      {/* Table — desktop */}
      <div className="card overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Product</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Qty</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Issued By</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Reason</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Entry By</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                    No entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmt(entry.date)}</td>
                    <td className="px-4 py-3">
                      <span className={entry.type === 'IN' ? 'badge-in' : 'badge-out'}>
                        {entry.type === 'IN' ? '↑ IN' : '↓ OUT'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[160px] truncate">
                      {entry.productName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {entry.quantity} {entry.unit}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[120px] truncate">{entry.issuedBy}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{entry.reason}</td>
                    <td className="px-4 py-3">
                      <span className={
                        entry.status === 'APPROVED' ? 'badge-approved'
                        : entry.status === 'REJECTED' ? 'badge-rejected'
                        : 'badge-pending'
                      }>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[120px] truncate">
                      {entry.createdBy.name}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(entry)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — mobile */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-slate-400 text-sm">No entries found.</div>
        ) : (
          filtered.map((entry) => (
            <div key={entry.id} className="card p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={entry.type === 'IN' ? 'badge-in' : 'badge-out'}>
                    {entry.type === 'IN' ? '↑ IN' : '↓ OUT'}
                  </span>
                  <span className={
                    entry.status === 'APPROVED' ? 'badge-approved'
                    : entry.status === 'REJECTED' ? 'badge-rejected'
                    : 'badge-pending'
                  }>
                    {entry.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(entry)}
                  className="text-blue-600 text-xs font-medium shrink-0"
                >
                  View
                </button>
              </div>
              <p className="font-semibold text-slate-800">{entry.productName}</p>
              <div className="text-xs text-slate-500 space-y-0.5">
                <p>Qty: {entry.quantity} {entry.unit}</p>
                <p>Issued by: {entry.issuedBy}</p>
                <p>Reason: {entry.reason}</p>
                <p>Date: {fmt(entry.date)}</p>
                <p>Entry by: {entry.createdBy.name}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Entry Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-2">
                <span className={selected.type === 'IN' ? 'badge-in' : 'badge-out'}>
                  {selected.type === 'IN' ? '↑ IN' : '↓ OUT'}
                </span>
                <span className={
                  selected.status === 'APPROVED' ? 'badge-approved'
                  : selected.status === 'REJECTED' ? 'badge-rejected'
                  : 'badge-pending'
                }>
                  {selected.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Detail label="Product" value={selected.productName} />
                <Detail label="Quantity" value={`${selected.quantity} ${selected.unit}`} />
                <Detail label="Date" value={fmt(selected.date)} />
                <Detail label="Issued By" value={selected.issuedBy} />
                <Detail label="Reason" value={selected.reason} span />
                {selected.description && <Detail label="Description" value={selected.description} span />}
                <Detail label="Entry By" value={selected.createdBy.name} />
                <Detail label="Entry Date" value={fmt(selected.createdAt)} />
                {selected.approvedBy && (
                  <Detail label="Approved By" value={selected.approvedBy.name} />
                )}
                {selected.approvedAt && (
                  <Detail label="Approved At" value={fmt(selected.approvedAt)} />
                )}
                {selected.remarks && (
                  <Detail label="Remarks" value={selected.remarks} span />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-slate-800">{value}</p>
    </div>
  );
}
