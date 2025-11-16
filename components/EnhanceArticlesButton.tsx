'use client';

import { useState } from 'react';

export default function EnhanceArticlesButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const handleEnhance = async (dryRun: boolean = false) => {
    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const response = await fetch('/api/enhance-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun }),
      });

      const data = await response.json();

      if (response.ok) {
        if (dryRun) {
          setMessage({
            type: 'success',
            text: `Dry run completed: ${data.message}. Check console for details.`,
          });
          console.log('Dry run results:', data);
        } else {
          setMessage({
            type: 'success',
            text: data.message || 'Articles enhanced successfully!',
          });
        }
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to enhance articles',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Enhance Articles
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Improve markdown formatting, spacing, headings, and add hyperlinks to
        research articles in all published questions.
      </p>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => handleEnhance(true)}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Running...' : 'Dry Run (Preview)'}
        </button>
        <button
          onClick={() => handleEnhance(false)}
          disabled={loading}
          className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enhancing...' : 'Enhance All Articles'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        ⚠️ This will update all published articles. Use "Dry Run" first to
        preview changes. This may take several minutes for many articles.
      </p>
    </div>
  );
}

