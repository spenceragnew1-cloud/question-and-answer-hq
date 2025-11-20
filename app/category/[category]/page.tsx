import { supabase } from '@/lib/supabase';
import QuestionCard from '@/components/QuestionCard';
import { CATEGORIES, formatCategoryName, isValidCategory, getCategoryDescription } from '@/lib/categories';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCategoryQuestions(category: string, page: number = 1, initialLimit: number = 20) {
  const perPage = 12;
  
  // For first page (no page param or page=1), show initialLimit items
  // For subsequent pages, use pagination starting from item 21
  let offset: number;
  let limit: number;
  
  if (page === 1) {
    offset = 0;
    limit = initialLimit;
  } else {
    // Page 2 starts from item 21 (after the initial 20)
    offset = initialLimit + (page - 2) * perPage;
    limit = perPage;
  }

  const { data, count } = await supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .eq('category', category)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Calculate total pages: first page shows 20, remaining pages show 12 each
  const remainingAfterFirst = Math.max(0, (count || 0) - initialLimit);
  const additionalPages = Math.ceil(remainingAfterFirst / perPage);
  const totalPages = (count || 0) > initialLimit ? 1 + additionalPages : 1;

  return {
    questions: data || [],
    total: count || 0,
    page,
    totalPages,
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
    description: getCategoryDescription(category),
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
  const { questions, total, totalPages } = await getCategoryQuestions(category, page, 20);
  const categoryName = formatCategoryName(category);
  const description = getCategoryDescription(category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://questionandanswerhq.com';
  const categoryUrl = `${siteUrl}/category/${category}`;

  // CollectionPage JSON-LD schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Questions`,
    description: description,
    url: categoryUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total,
      itemListElement: questions.map((question, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Question',
          name: question.question,
          url: `${siteUrl}/questions/${question.slug}`,
          answerCount: 1,
        },
      })),
    },
  };

  const showViewAllButton = page === 1 && total > 20;

  return (
    <div className="min-h-screen bg-gray-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {categoryName}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          {description}
        </p>

        {questions.length > 0 ? (
          <>
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

            {showViewAllButton && (
              <div className="text-center mb-8">
                <Link
                  href={`/category/${category}?page=2`}
                  className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors font-medium"
                >
                  View All {total} Questions →
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && page > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                {page > 1 && (
                  <Link
                    href={`/category/${category}?page=${page - 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/category/${category}?page=${page + 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center py-12">
            No questions published in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
