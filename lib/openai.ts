import OpenAI from 'openai';
import { slugify } from './slugify';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface GeneratedContent {
  question: string;
  slug: string;
  short_answer: string;
  verdict: 'works' | 'doesnt_work' | 'mixed';
  summary: string;
  body_markdown: string;
  evidence: Array<{
    title: string;
    url: string;
    explanation: string;
  }>;
  sources: string[];
  tags: string[];
}

export async function generateQuestionAnswer(
  proposedQuestion: string,
  category: string,
  tags?: string[],
  notes?: string
): Promise<GeneratedContent> {
  const prompt = `You are a research expert. Generate a comprehensive, research-backed answer to the following question.

Proposed Question: ${proposedQuestion}
Category: ${category}
${tags && tags.length > 0 ? `Tags: ${tags.join(', ')}` : ''}
${notes ? `Additional Context: ${notes}` : ''}

Requirements:
1. Generate a clear, well-formulated QUESTION that refines the proposed question if needed
2. Create a URL-friendly SLUG for the question (lowercase, hyphens, no special chars)
3. Provide a short_answer (2-3 sentences)
4. Provide a verdict: 'works', 'doesnt_work', or 'mixed'
5. Provide a summary (2-3 paragraphs)
6. Provide a detailed body_markdown (600-900 words) with proper markdown formatting including:
   - Headings (H2, H3) for organization
   - Proper spacing between sections
   - Bullet lists and numbered lists where appropriate
   - Blockquotes for important findings
   - Hyperlinks to research sources
7. Provide evidence array with at least 3-5 sources. Prioritize:
   - PubMed articles first
   - .gov sources
   - Major medical institutions (Mayo Clinic, Cleveland Clinic, etc.)
   - Smithsonian, National Geographic
   - BBC, NYT, Reuters
   - Consumer Reports
   - Other reputable sources
8. Provide sources array with 2-5 high-quality source URLs. These should be:
   - PubMed articles (pubmed.ncbi.nlm.nih.gov)
   - .gov sources (nih.gov, cdc.gov, etc.)
   - .edu sources (university research)
   - Official medical guidelines
   - Each URL must be a valid, accessible link
9. Provide tags array (use the provided tags if available, or generate relevant tags)

IMPORTANT: Base all claims on real research. Prefer PubMed, .gov, .edu, major guidelines, or high-quality references.

Format your response as JSON with this exact structure:
{
  "question": "The refined, clear question text",
  "slug": "url-friendly-slug-here",
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
  ],
  "sources": [
    "https://pubmed.ncbi.nlm.nih.gov/...",
    "https://www.nih.gov/...",
    "https://www.mayoclinic.org/..."
  ],
  "tags": ["tag1", "tag2", "tag3"]
}

Be thorough, accurate, and cite real sources when possible.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a research expert who provides accurate, well-sourced answers to questions. Always respond with valid JSON. Always include all required fields.',
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
    
    // Ensure all required fields have fallbacks
    if (!parsed.sources || !Array.isArray(parsed.sources)) {
      parsed.sources = [];
    }
    if (!parsed.tags || !Array.isArray(parsed.tags)) {
      parsed.tags = tags || [];
    }
    if (!parsed.slug) {
      parsed.slug = slugify(parsed.question || proposedQuestion);
    }
    if (!parsed.question) {
      parsed.question = proposedQuestion;
    }
    
    return parsed;
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}
