// app/dashboard/new-entry/page.tsx
export const dynamic = 'force-dynamic';

import NewEntryForm from './NewEntryForm';

export default function NewEntryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">New Inventory Entry</h1>
        <p className="text-slate-500 text-sm mt-1">
          Fill in the details below. The entry will be sent for approval.
        </p>
      </div>
      <NewEntryForm />
    </div>
  );
}
