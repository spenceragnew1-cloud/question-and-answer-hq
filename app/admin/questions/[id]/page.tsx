import { supabaseAdmin } from '@/lib/supabase';
import QuestionForm from '@/components/QuestionForm';
import { notFound } from 'next/navigation';

async function getQuestion(id: string) {
  const { data } = await supabaseAdmin
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();

  return data;
}

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await getQuestion(id);

  if (!question) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Question</h1>
      <QuestionForm question={question} />
    </div>
  );
}

