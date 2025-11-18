import { supabase } from '@/lib/supabase';
import QuestionCard from '@/components/QuestionCard';
import { CATEGORIES, formatCategoryName, isValidCategory } from '@/lib/categories';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCategoryQuestions(category: string, page: number = 1) {
  const perPage = 12;
  const offset = (page - 1) * perPage;

  const { data, count } = await supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .eq('category', category)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  return {
    questions: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategory(category)) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryName = formatCategoryName(category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://questionandanswerhq.com';
  
  return {
    title: `${categoryName} Questions | QuestionAndAnswerHQ`,
    description: `Browse all questions and answers in the ${categoryName} category.`,
    alternates: {
      canonical: `${siteUrl}/category/${category}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  
  if (!isValidCategory(category)) {
    notFound();
  }

  const page = parseInt(pageParam || '1', 10);
  const { questions, total, totalPages } = await getCategoryQuestions(
    category,
    page
  );
  const categoryName = formatCategoryName(category);

  return (
    <div className="min-h-screen bg-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {categoryName}
        </h1>
        <p className="text-gray-600 mb-8">
          {total} question{total !== 1 ? 's' : ''} in this category
        </p>

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
            No questions published in this category yet.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            {page > 1 && (
              <a
                href={`/category/${category}?page=${page - 1}`}
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
                href={`/category/${category}?page=${page + 1}`}
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

