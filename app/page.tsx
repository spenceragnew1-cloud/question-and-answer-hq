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
              <CategoryCard key={category} category={category} />
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
      </div>
    </div>
  );
}

