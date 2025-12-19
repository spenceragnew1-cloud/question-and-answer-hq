import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin | Question & Answer HQ',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Auth is now handled by middleware.ts
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Admin</h1>
        {children}
      </main>
    </div>
  );
}