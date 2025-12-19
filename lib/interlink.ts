import { supabase } from './supabase';

export interface Question {
  id: string;
  slug: string;
  question: string;
  short_answer: string | null;
  category: string;
  summary: string | null;
}

export async function getRelatedQuestions(
  currentQuestionId: string,
  category: string,
  limit: number = 5
): Promise<Question[]> {
  // First, try to get questions from the same category
  const { data: sameCategory } = await supabase
    .from('questions')
    .select('id, slug, question, short_answer, category, summary')
    .eq('category', category)
    .eq('status', 'published')
    .neq('id', currentQuestionId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (sameCategory && sameCategory.length >= limit) {
    return sameCategory;
  }

  // If we need more, fill with recent published questions
  const needed = limit - (sameCategory?.length || 0);
  if (needed > 0) {
    const { data: recent } = await supabase
      .from('questions')
      .select('id, slug, question, short_answer, category, summary')
      .eq('status', 'published')
      .neq('id', currentQuestionId)
      .not('category', 'eq', category)
      .order('published_at', { ascending: false })
      .limit(needed);

    return [...(sameCategory || []), ...(recent || [])];
  }

  return sameCategory || [];
}

