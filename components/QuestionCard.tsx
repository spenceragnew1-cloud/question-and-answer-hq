'use client';

import Link from 'next/link';
import { getCategoryById } from '@/lib/categories';

interface QuestionCardProps {
  id: string;
  slug: string;
  question: string;
  short_answer?: string | null;
  category: string;
  summary?: string | null;
  published_at?: string | null;
  verdict?: 'works' | 'doesnt_work' | 'mixed' | null;
}

export default function QuestionCard({
  slug,
  question,
  short_answer,
  category,
  summary,
  published_at,
  verdict,
}: QuestionCardProps) {
  const verdictColors = {
    works: 'bg-green-100 text-green-800',
    doesnt_work: 'bg-red-100 text-red-800',
    mixed: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
      <Link href={`/questions/${slug}`} className="block">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
            {question}
          </h3>
          {verdict && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                verdictColors[verdict]
              }`}
            >
              {verdict === 'works'
                ? 'Works'
                : verdict === 'doesnt_work'
                ? "Doesn't Work"
                : 'Mixed'}
            </span>
          )}
        </div>
        {(short_answer || summary) && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {short_answer || summary}
          </p>
        )}
      </Link>
      <div className="flex items-center justify-between">
        {(() => {
          const categoryDef = getCategoryById(category);
          if (!categoryDef) {
            // Fallback for invalid categories
            return (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {category}
              </span>
            );
          }
          return (
            <Link
              href={`/category/${categoryDef.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-100 transition-colors"
            >
              {categoryDef.label}
            </Link>
          );
        })()}
        {published_at && (
          <span className="text-sm text-gray-500">
            {new Date(published_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

