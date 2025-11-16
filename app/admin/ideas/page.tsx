import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { formatCategoryName } from '@/lib/categories';
import IdeaForm from '@/components/IdeaForm';

async function getIdeas() {
  const { data } = await supabaseAdmin
      .from('ideas')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminIdeasPage() {
  const ideas = await getIdeas();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ideas</h1>
      </div>

      {/* Add New Idea Form */}
      <div className="mb-8">
        <IdeaForm />
      </div>

      {/* Ideas Table */}
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
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ideas.map((idea) => (
              <tr key={idea.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {idea.proposed_question}
                  </div>
                  {idea.notes && (
                    <div className="text-sm text-gray-500 mt-1">{idea.notes}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {formatCategoryName(idea.category)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      idea.status === 'new'
                        ? 'bg-blue-100 text-blue-800'
                        : idea.status === 'draft_generated'
                        ? 'bg-green-100 text-green-800'
                        : idea.status === 'approved'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {idea.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {idea.priority || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(idea.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ideas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No ideas yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
}

