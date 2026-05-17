'use client';
// app/dashboard/approvals/ApprovalsList.tsx
import { useState, useTransition } from 'react';
import { approveEntry, rejectEntry } from './actions';

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
  createdAt: Date;
  createdBy: { name: string; email: string };
};

type ModalState = {
  entry: Entry;
  action: 'approve' | 'reject';
} | null;

export default function ApprovalsList({ entries }: { entries: Entry[] }) {
  const [modal, setModal] = useState<ModalState>(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [processed, setProcessed] = useState<Set<string>>(new Set());

  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  const timeAgo = (d: Date) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  };

  function openModal(entry: Entry, action: 'approve' | 'reject') {
    setModal({ entry, action });
    setRemarks('');
    setError('');
  }

  function closeModal() {
    if (isPending) return;
    setModal(null);
    setRemarks('');
    setError('');
  }

  function handleConfirm() {
    if (!modal) return;
    setError('');

    startTransition(async () => {
      try {
        if (modal.action === 'approve') {
          await approveEntry(modal.entry.id, remarks);
        } else {
          await rejectEntry(modal.entry.id, remarks);
        }
        setProcessed((prev) => new Set(prev).add(modal.entry.id));
        setModal(null);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      }
    });
  }

  const visible = entries.filter((e) => !processed.has(e.id));

  if (visible.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-slate-700 mb-1">All done!</p>
        <p className="text-sm text-slate-400">All entries have been reviewed.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {visible.map((entry) => (
          <div key={entry.id} className="card p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={entry.type === 'IN' ? 'badge-in' : 'badge-out'}>
                  {entry.type === 'IN' ? '↑ IN' : '↓ OUT'}
                </span>
                <span className="badge-pending">PENDING</span>
                <span className="text-xs text-slate-400">{timeAgo(entry.createdAt)}</span>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mb-5">
              <Field label="Product" value={entry.productName} />
              <Field label="Quantity" value={`${entry.quantity} ${entry.unit}`} />
              <Field label="Date" value={fmt(entry.date)} />
              <Field label="Issued By" value={entry.issuedBy} />
              <Field label="Submitted By" value={entry.createdBy.name} />
              <Field label="Submitted On" value={fmt(entry.createdAt)} />
              <Field label="Reason" value={entry.reason} span />
              {entry.description && <Field label="Description" value={entry.description} span />}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => openModal(entry, 'approve')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700
                           text-white text-sm font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
              <button
                onClick={() => openModal(entry, 'reject')}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50
                           text-red-600 border border-red-200 text-sm font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            {/* Modal header */}
            <div className={`px-5 py-4 border-b rounded-t-xl ${
              modal.action === 'approve'
                ? 'bg-green-50 border-green-100'
                : 'bg-red-50 border-red-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  modal.action === 'approve' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {modal.action === 'approve' ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {modal.action === 'approve' ? 'Approve Entry' : 'Reject Entry'}
                  </p>
                  <p className="text-sm text-slate-500">{modal.entry.productName} — {modal.entry.quantity} {modal.entry.unit}</p>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4">
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Remarks
                  {modal.action === 'reject' && <span className="text-red-500"> * (required for rejection)</span>}
                  {modal.action === 'approve' && <span className="text-slate-400 font-normal"> (optional)</span>}
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder={
                    modal.action === 'approve'
                      ? 'Any notes for this approval...'
                      : 'Explain why this entry is being rejected...'
                  }
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 pb-5 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isPending}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className={`flex items-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-lg
                            transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  modal.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : modal.action === 'approve' ? (
                  'Confirm Approval'
                ) : (
                  'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2 sm:col-span-3' : ''}>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}
