import { supabase } from '@/lib/supabase';
import { getRelatedQuestions } from '@/lib/interlink';
import { formatCategoryName } from '@/lib/categories';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

interface QuestionPageProps {
  params: Promise<{ slug: string }>;
}

async function getQuestion(slug: string) {
  const { data } = await supabase
    .from('questions')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = await getQuestion(slug);

  if (!question) {
    return {
      title: 'Question Not Found',
    };
  }

  return {
    title: `${question.question} | QuestionAndAnswerHQ`,
    description: question.summary || question.short_answer || '',
    openGraph: {
      title: question.question,
      description: question.summary || question.short_answer || '',
      type: 'article',
      publishedTime: question.published_at || undefined,
    },
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const question = await getQuestion(slug);

  if (!question) {
    notFound();
  }

  const relatedQuestions = await getRelatedQuestions(
    question.id,
    question.category,
    5
  );

  const verdictColors: Record<'works' | 'doesnt_work' | 'mixed', string> = {
    works: 'bg-green-100 text-green-800',
    doesnt_work: 'bg-red-100 text-red-800',
    mixed: 'bg-yellow-100 text-yellow-800',
  };

  const evidence = question.evidence_json as
    | Array<{ title: string; url: string; explanation: string }>
    | null;

  // Build Q&A JSON-LD schema
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://questionandanswerhq.com';
  const questionUrl = `${siteUrl}/questions/${question.slug}`;
  const publishedDate =
    question.published_at || new Date().toISOString();
  
  // Get text content for Question and Answer
  const questionText =
    question.summary || question.short_answer || question.body_markdown || '';
  const answerText =
    question.short_answer || question.summary || question.body_markdown || '';

  const qaSchema = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.question,
      text: questionText,
      datePublished: publishedDate,
      author: {
        '@type': 'Organization',
        name: 'Question and Answer HQ',
      },
      acceptedAnswer: {
        '@type': 'Answer',
        text: answerText,
        url: questionUrl,
        datePublished: publishedDate,
        author: {
          '@type': 'Organization',
          name: 'Question and Answer HQ',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          {/* Question */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {question.question}
          </h1>

          {/* Short Answer */}
          {question.short_answer && (
            <div className="mb-6 p-4 bg-teal-50 rounded-lg border-l-4 border-teal">
              <p className="text-lg text-gray-800">{question.short_answer}</p>
            </div>
          )}

          {/* Verdict Badge */}
          {question.verdict && (
            <div className="mb-6">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  verdictColors[question.verdict as keyof typeof verdictColors]
                }`}
              >
                {question.verdict === 'works'
                  ? '✓ Works'
                  : question.verdict === 'doesnt_work'
                  ? "✗ Doesn't Work"
                  : '~ Mixed Results'}
              </span>
            </div>
          )}

          {/* Summary */}
          {question.summary && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{question.summary}</p>
            </div>
          )}

          {/* Body Markdown */}
          {question.body_markdown && (
            <article className="mb-8 prose prose-lg prose-teal max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal hover:text-teal-dark underline"
                    />
                  ),
                }}
              >
                {question.body_markdown || ''}
              </ReactMarkdown>
            </article>
          )}

          {/* Evidence */}
          {evidence && evidence.length > 0 && (
            <section className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Sources & Evidence
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                {evidence.map((item, idx) => (
                  <li key={idx} className="text-gray-700">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal hover:text-teal-dark underline"
                    >
                      {item.title || item.url}
                    </a>
                    {item.explanation && (
                      <span className="text-gray-600 text-sm ml-2">
                        - {item.explanation}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sources */}
          {question.sources && question.sources.length > 0 && (
            <section className="mt-10 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">Sources</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {question.sources.map((src: string, idx: number) => (
                  <li key={idx}>
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 break-all"
                    >
                      {src}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Meta Info */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-medium">
                {formatCategoryName(question.category)}
              </span>
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {question.published_at && (
                <span>
                  Published {new Date(question.published_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </article>

        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Related Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedQuestions.map((related) => (
                <Link
                  key={related.id}
                  href={`/questions/${related.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {related.question}
                  </h3>
                  {related.short_answer && (
                    <p className="text-gray-600 line-clamp-2">
                      {related.short_answer}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(qaSchema),
          }}
        />
      </div>
    </div>
  );
}

