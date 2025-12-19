import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import EnhanceArticlesButton from '@/components/EnhanceArticlesButton';

async function getStats() {
  const [questions, ideas, subscribers] = await Promise.all([
    supabaseAdmin
      .from('questions')
      .select('status', { count: 'exact', head: true }),
    supabaseAdmin
      .from('ideas')
      .select('status', { count: 'exact', head: true }),
    supabaseAdmin
      .from('subscribers')
      .select('*', { count: 'exact', head: true }),
  ]);

  const questionsByStatus = await supabaseAdmin
    .from('questions')
    .select('status');

  const stats = {
    questions: {
      total: questions.count || 0,
      draft: questionsByStatus.data?.filter((q) => q.status === 'draft').length || 0,
      approved: questionsByStatus.data?.filter((q) => q.status === 'approved').length || 0,
      scheduled: questionsByStatus.data?.filter((q) => q.status === 'scheduled').length || 0,
      published: questionsByStatus.data?.filter((q) => q.status === 'published').length || 0,
    },
    ideas: {
      total: ideas.count || 0,
    },
    subscribers: {
      total: subscribers.count || 0,
    },
  };

  return stats;
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Questions
          </h3>
          <p className="text-3xl font-bold text-gray-900">{stats.questions.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Published</h3>
          <p className="text-3xl font-bold text-teal">{stats.questions.published}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Drafts</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.questions.draft}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Subscribers</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.subscribers.total}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Questions by Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Draft</span>
              <span className="font-medium">{stats.questions.draft}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approved</span>
              <span className="font-medium">{stats.questions.approved}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Scheduled</span>
              <span className="font-medium">{stats.questions.scheduled}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Published</span>
              <span className="font-medium text-teal">
                {stats.questions.published}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/questions/new"
              className="block w-full px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors text-center"
            >
              Create New Question
            </Link>
            <Link
              href="/admin/questions"
              className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Manage Questions
            </Link>
            <Link
              href="/admin/ideas"
              className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Ideas
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <EnhanceArticlesButton />
      </div>
    </div>
  );
}

