import Link from 'next/link';
import { formatCategoryName } from '@/lib/categories';

interface QuestionOfTheDayProps {
  id: string;
  slug: string;
  question: string;
  short_answer?: string | null;
  summary?: string | null;
  category: string;
  verdict?: 'works' | 'doesnt_work' | 'mixed' | null;
}

export default function QuestionOfTheDay({
  slug,
  question,
  short_answer,
  summary,
  category,
  verdict,
}: QuestionOfTheDayProps) {
  const verdictColors = {
    works: 'bg-green-100 text-green-800',
    doesnt_work: 'bg-red-100 text-red-800',
    mixed: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-8 text-white">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
          Question of the Day
        </span>
      </div>
      <h1 className="text-4xl font-bold mb-4">{question}</h1>
      {(short_answer || summary) && (
        <p className="text-xl mb-6 text-teal-50 line-clamp-3">
          {short_answer || summary}
        </p>
      )}
      <div className="flex items-center gap-4 mb-6">
        <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
          {formatCategoryName(category)}
        </span>
        {verdict && (
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
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
      <Link
        href={`/questions/${slug}`}
        className="inline-block px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Read More →
      </Link>
    </div>
  );
}

