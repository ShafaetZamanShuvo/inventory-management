'use client';
// app/dashboard/new-entry/NewEntryForm.tsx
import { useRef, useState, useTransition } from 'react';
import { createEntry } from './actions';

const UNITS = ['pcs', 'kg', 'g', 'litre', 'ml', 'box', 'carton', 'pack', 'roll', 'set', 'pair', 'bottle'];

export default function NewEntryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      try {
        await createEntry(formData);
      } catch (err: any) {
        // redirect() throws internally — ignore NEXT_REDIRECT
        if (err?.message?.includes('NEXT_REDIRECT')) return;
        setError(err.message || 'Something went wrong. Please try again.');
      }
    });
  }

  // Default date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="card p-5 sm:p-6 space-y-5">

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3.5">
            <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Type selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Entry Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['IN', 'OUT'] as const).map((t) => (
              <label
                key={t}
                className="relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer
                           has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 border-slate-200
                           hover:border-slate-300 transition-all"
              >
                <input type="radio" name="type" value={t} className="sr-only" defaultChecked={t === 'IN'} required />
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  t === 'IN' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  {t === 'IN' ? (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{t === 'IN' ? 'Stock IN' : 'Stock OUT'}</p>
                  <p className="text-xs text-slate-500">
                    {t === 'IN' ? 'Item entering inventory' : 'Item leaving inventory'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Date & Issued By */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              defaultValue={today}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Issued By (Person) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="issuedBy"
              placeholder="Name of person issuing"
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Product Name & Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="productName"
            placeholder="e.g. A4 Paper Ream, Printer Cartridge"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="description"
            placeholder="Additional details about the item..."
            className="input-field resize-none"
            rows={2}
          />
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              placeholder="0"
              min="0.01"
              step="0.01"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Unit <span className="text-red-500">*</span>
            </label>
            <select name="unit" className="input-field" required>
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            placeholder="Why is this item entering or leaving inventory?"
            className="input-field resize-none"
            rows={3}
            required
          />
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3.5">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-amber-700">
            This entry will be submitted as <strong>Pending</strong> and must be approved by an Approver or Admin before it is counted.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <a href="/dashboard/entries" className="btn-secondary">
          Cancel
        </a>
        <button type="submit" disabled={isPending} className="btn-primary flex items-center gap-2">
          {isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit Entry
            </>
          )}
        </button>
      </div>
    </form>
  );
}
