import { supabase } from '@/lib/supabase';
import QuestionCard from '@/components/QuestionCard';
import SearchBar from '@/components/SearchBar';
import { CATEGORIES, getCategoryById } from '@/lib/categories';
import type { Metadata } from 'next';

interface SearchParams {
  q?: string;
  category?: string;
  page?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://questionandanswerhq.com';
  
  return {
    title: 'All Questions | QuestionAndAnswerHQ',
    description: 'Browse all research-backed questions and answers.',
    alternates: {
      canonical: `${siteUrl}/questions`,
    },
  };
}

async function getQuestions(searchParams: SearchParams) {
  const query = searchParams.q || '';
  const category = searchParams.category;
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = 12;
  const offset = (page - 1) * perPage;

  let supabaseQuery = supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (category) {
    supabaseQuery = supabaseQuery.eq('category', category);
  }

  if (query) {
    // Full-text search over question, summary, and tags
    const searchPattern = `%${query}%`;
    supabaseQuery = supabaseQuery.or(
      `question.ilike.${searchPattern},summary.ilike.${searchPattern}`
    );
  }

  const { data, count, error } = await supabaseQuery;

  return {
    questions: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { questions, total, page, totalPages } = await getQuestions(resolvedSearchParams);
  const selectedCategory = resolvedSearchParams.category;

  return (
    <div className="min-h-screen bg-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">All Questions</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <a
              href="/questions"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-teal text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </a>
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`/questions?category=${cat.id}`}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-teal text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          {total} question{total !== 1 ? 's' : ''} found
        </p>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              slug={question.slug}
              question={question.question}
              short_answer={question.short_answer}
              category={question.category}
              summary={question.summary}
              published_at={question.published_at}
              verdict={question.verdict}
            />
          ))}
        </div>

        {questions.length === 0 && (
          <p className="text-gray-500 text-center py-12">
            No questions found. Try adjusting your search or filters.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            {page > 1 && (
              <a
                href={`/questions?${new URLSearchParams({
                  ...resolvedSearchParams,
                  page: String(page - 1),
                }).toString()}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </a>
            )}
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <a
                href={`/questions?${new URLSearchParams({
                  ...resolvedSearchParams,
                  page: String(page + 1),
                }).toString()}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

