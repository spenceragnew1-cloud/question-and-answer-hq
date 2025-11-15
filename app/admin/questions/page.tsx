import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { formatCategoryName } from '@/lib/categories';

interface SearchParams {
  status?: string;
}

async function getQuestions(searchParams: SearchParams) {
  let query = supabaseAdmin
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }

  const { data } = await query;
  return data || [];
}

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const questions = await getQuestions(resolvedSearchParams);
  const selectedStatus = resolvedSearchParams.status || 'all';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
        <Link
          href="/admin/questions/new"
          className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors"
        >
          New Question
        </Link>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/questions"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'all'
                ? 'bg-teal text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </a>
          <a
            href="/admin/questions?status=draft"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'draft'
                ? 'bg-teal text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Draft
          </a>
          <a
            href="/admin/questions?status=approved"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'approved'
                ? 'bg-teal text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Approved
          </a>
          <a
            href="/admin/questions?status=scheduled"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'scheduled'
                ? 'bg-teal text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Scheduled
          </a>
          <a
            href="/admin/questions?status=published"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'published'
                ? 'bg-teal text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Published
          </a>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                    {question.question}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {formatCategoryName(question.category)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      question.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : question.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : question.status === 'approved'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {question.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(question.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="text-teal hover:text-teal-dark font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {questions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No questions found.
          </div>
        )}
      </div>
    </div>
  );
}

