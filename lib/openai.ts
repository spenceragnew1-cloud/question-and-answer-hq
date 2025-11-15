import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface GeneratedContent {
  short_answer: string;
  verdict: 'works' | 'doesnt_work' | 'mixed';
  summary: string;
  body_markdown: string;
  evidence: Array<{
    title: string;
    url: string;
    explanation: string;
  }>;
}

export async function generateQuestionAnswer(
  question: string,
  category: string
): Promise<GeneratedContent> {
  const prompt = `You are a research expert. Generate a comprehensive, research-backed answer to the following question.

Question: ${question}
Category: ${category}

Requirements:
1. Provide a short_answer (2-3 sentences)
2. Provide a verdict: 'works', 'doesnt_work', or 'mixed'
3. Provide a summary (2-3 paragraphs)
4. Provide a detailed body_markdown (600-900 words) with proper markdown formatting
5. Provide evidence array with at least 3-5 sources. Prioritize:
   - PubMed articles first
   - .gov sources
   - Major medical institutions (Mayo Clinic, Cleveland Clinic, etc.)
   - Smithsonian, National Geographic
   - BBC, NYT, Reuters
   - Consumer Reports
   - Other reputable sources

Format your response as JSON with this exact structure:
{
  "short_answer": "...",
  "verdict": "works|doesnt_work|mixed",
  "summary": "...",
  "body_markdown": "...",
  "evidence": [
    {
      "title": "...",
      "url": "...",
      "explanation": "..."
    }
  ]
}

Be thorough, accurate, and cite real sources when possible.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o', // Using GPT-4o (latest), can be changed to gpt-4-turbo if preferred
    messages: [
      {
        role: 'system',
        content:
          'You are a research expert who provides accurate, well-sourced answers to questions. Always respond with valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsed = JSON.parse(content) as GeneratedContent;
    return parsed;
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

