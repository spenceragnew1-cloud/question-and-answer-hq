'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, type CategoryId } from '@/lib/categories';

export default function IdeaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<{
    proposed_question: string;
    category: CategoryId;
    tags: string;
    notes: string;
    priority: string;
  }>({
    proposed_question: '',
    category: CATEGORIES[0].id,
    tags: '',
    notes: '',
    priority: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.proposed_question.trim()) {
        setError('Proposed question is required');
        setLoading(false);
        return;
      }

      const payload = {
        proposed_question: formData.proposed_question.trim(),
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        notes: formData.notes.trim() || null,
        priority: formData.priority ? parseInt(formData.priority, 10) : null,
      };

      const response = await fetch('/api/ideas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          proposed_question: '',
          category: CATEGORIES[0].id,
          tags: '',
          notes: '',
          priority: '',
        });
        // Refresh the page to show the new idea
        setTimeout(() => {
          router.refresh();
          setSuccess(false);
        }, 1500);
      } else {
        setError(data.error || 'Failed to create idea');
      }
    } catch (err) {
      console.error('Error creating idea:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Idea</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add a new question idea that will be automatically processed by AI to generate draft content.
      </p>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          Idea created successfully! Refreshing...
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposed Question *
          </label>
          <input
            type="text"
            value={formData.proposed_question}
            onChange={(e) =>
              setFormData({ ...formData, proposed_question: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as CategoryId })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <input
            type="number"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Add Idea'}
      </button>
    </form>
  );
}

