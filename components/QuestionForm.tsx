'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';

interface Question {
  id?: string;
  question: string;
  slug: string;
  short_answer?: string | null;
  verdict?: 'works' | 'doesnt_work' | 'mixed' | null;
  category: string;
  summary?: string | null;
  body_markdown?: string | null;
  evidence_json?: any;
  tags?: string[] | null;
  status: string;
  published_at?: string | null;
  scheduled_for?: string | null;
}

interface QuestionFormProps {
  question?: Question;
}

export default function QuestionForm({ question }: QuestionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Question>>({
    question: question?.question || '',
    slug: question?.slug || '',
    short_answer: question?.short_answer || '',
    verdict: question?.verdict || null,
    category: question?.category || CATEGORIES[0],
    summary: question?.summary || '',
    body_markdown: question?.body_markdown || '',
    tags: question?.tags || [],
    status: question?.status || 'draft',
    scheduled_for: question?.scheduled_for
      ? new Date(question.scheduled_for).toISOString().slice(0, 16)
      : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload: any = {
        ...formData,
        tags: formData.tags || [],
        evidence_json: formData.evidence_json || null,
        scheduled_for: formData.scheduled_for
          ? new Date(formData.scheduled_for).toISOString()
          : null,
      };

      if (formData.status === 'published' && !payload.published_at) {
        payload.published_at = new Date().toISOString();
      }

      const url = question?.id
        ? `/api/questions/${question.id}/update`
        : '/api/questions/create';
      const method = question?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/admin/questions');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save question');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question *
          </label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Answer
          </label>
          <textarea
            value={formData.short_answer || ''}
            onChange={(e) =>
              setFormData({ ...formData, short_answer: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verdict
          </label>
          <select
            value={formData.verdict || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                verdict: e.target.value as any || null,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          >
            <option value="">None</option>
            <option value="works">Works</option>
            <option value="doesnt_work">Doesn't Work</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          <textarea
            value={formData.summary || ''}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body (Markdown)
          </label>
          <textarea
            value={formData.body_markdown || ''}
            onChange={(e) =>
              setFormData({ ...formData, body_markdown: e.target.value })
            }
            rows={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-mono text-sm text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          >
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule For (optional)
          </label>
          <input
            type="datetime-local"
            value={formData.scheduled_for || ''}
            onChange={(e) =>
              setFormData({ ...formData, scheduled_for: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Question'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

