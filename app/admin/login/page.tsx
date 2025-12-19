'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include', // Ensure cookies are sent
      });

      if (res.ok) {
        // Use window.location for a full page reload to ensure cookie is recognized
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center mb-2">Admin Login</h1>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">
            Admin Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-teal-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-teal-400 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
