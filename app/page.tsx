import { supabase } from '@/lib/supabase';
import QuestionOfTheDay from '@/components/QuestionOfTheDay';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import QuestionCard from '@/components/QuestionCard';
import EmailSignup from '@/components/EmailSignup';
import { CATEGORIES } from '@/lib/categories';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QuestionAndAnswerHQ | Research-Backed Answers',
  description: 'Research-backed answers to your questions, updated daily.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://questionandanswerhq.com',
  },
};

async function getQuestionOfTheDay() {
  const { data } = await supabase
    .from('questions')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  return data;
}

async function getLatestQuestions() {
  const { data } = await supabase
    .from('questions')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10);

  return data || [];
}

export default async function HomePage() {
  const questionOfTheDay = await getQuestionOfTheDay();
  const latestQuestions = await getLatestQuestions();

  return (
    <div className="min-h-screen bg-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Question of the Day */}
        {questionOfTheDay && (
          <div className="mb-12">
            <QuestionOfTheDay
              id={questionOfTheDay.id}
              slug={questionOfTheDay.slug}
              question={questionOfTheDay.question}
              short_answer={questionOfTheDay.short_answer}
              summary={questionOfTheDay.summary}
              category={questionOfTheDay.category}
              verdict={questionOfTheDay.verdict}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-12">
          <Suspense fallback={
            <div className="w-full max-w-2xl mx-auto">
              <div className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg bg-gray-100 animate-pulse" />
            </div>
          }>
            <SearchBar />
          </Suspense>
        </div>

        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category.slug} />
            ))}
          </div>
        </section>

        {/* Latest Questions */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Latest Questions</h2>
            <Link
              href="/questions"
              className="text-teal hover:text-teal-dark font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestQuestions.map((question) => (
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
          {latestQuestions.length === 0 && (
            <p className="text-gray-500 text-center py-12">
              No questions published yet. Check back soon!
            </p>
          )}
        </section>

        {/* Email Signup */}
        <section className="mb-12">
          <EmailSignup />
        </section>

        {/* Frequently Asked Questions */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                What is QuestionAndAnswerHQ?
              </h3>
              <p className="text-gray-600">
                QuestionAndAnswerHQ provides research-backed answers to everyday
                questions across health, nutrition, fitness, science,
                relationships, home living, and more. Each question is written
                to be simple, factual, and helpful.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                How do you create the answers?
              </h3>
              <p className="text-gray-600">
                Our content is produced using a combination of human oversight
                and AI-assisted research. Each answer goes through a review
                process to ensure clarity, accuracy, and alignment with trusted
                scientific sources.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                How often are new questions published?
              </h3>
              <p className="text-gray-600">
                New questions are published automatically every day, helping the
                site grow consistently while covering more topics over time.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                Where does your research come from?
              </h3>
              <p className="text-gray-600">
                Sources include peer-reviewed studies, PubMed articles, medical
                organizations, government research websites, and reputable
                science-based publications.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                Can I trust the accuracy of the answers?
              </h3>
              <p className="text-gray-600">
                Yes. Every answer includes sources, citations, or references to
                authoritative research. Our review process ensures the content
                remains reliable and easy to understand.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FAQPage JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is QuestionAndAnswerHQ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'QuestionAndAnswerHQ provides research-backed answers to everyday questions across health, nutrition, fitness, science, relationships, home living, and more. Each question is written to be simple, factual, and helpful.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do you create the answers?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our content is produced using a combination of human oversight and AI-assisted research. Each answer goes through a review process to ensure clarity, accuracy, and alignment with trusted scientific sources.',
                },
              },
              {
                '@type': 'Question',
                name: 'How often are new questions published?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'New questions are published automatically every day, helping the site grow consistently while covering more topics over time.',
                },
              },
              {
                '@type': 'Question',
                name: 'Where does your research come from?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sources include peer-reviewed studies, PubMed articles, medical organizations, government research websites, and reputable science-based publications.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I trust the accuracy of the answers?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Every answer includes sources, citations, or references to authoritative research. Our review process ensures the content remains reliable and easy to understand.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}

