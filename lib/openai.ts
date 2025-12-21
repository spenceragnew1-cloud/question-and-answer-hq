import OpenAI from 'openai';
import { slugify } from './slugify';

// Lazy-load OpenAI client to allow environment variables to be loaded first
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY environment variable is missing. Please set it in your .env.local file or environment.'
      );
    }
    openaiClient = new OpenAI({
      apiKey,
    });
  }
  return openaiClient;
}

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
  tags?: string[] | null,
  notes?: string | null
): Promise<GeneratedContent> {
  // Ensure tags is always an array
  const tagsArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);
  
  const prompt = `Q&A HQ — NEXT-GEN ARTICLE GENERATION PROMPT (USE THIS EXACT VERSION)

Your task:

Generate a 600–900 word research-backed Q&A style article that matches the style, formatting, and structure of top-ranking health, fitness, parenting, productivity, relationships, cooking, animals, science, history, etc. articles — depending on the category.

The article will be published on Question & Answer HQ, a long-form Q&A site.

📌 REQUIRED OUTPUT FORMAT

Use Markdown with:

Clear H2 section headers

Occasional H3 subsections

Short intro paragraph (2–4 sentences)

Bullet lists where appropriate

Consistent spacing

Source list at the bottom

No filler or repetition

No self-references

No generic dictionary definitions

No disclaimers (unless medically required based on topic)

Keep formatting clean and readable.

📌 REQUIRED ARTICLE STRUCTURE

Your article must follow this structure EXACTLY:

1. Title (same as the question)

Use the question itself as the title (no quotes).

2. Short Answer (2–4 sentence summary)

Provide a fast, direct, evidence-based answer.

This is the "featured snippet" version.

3. In-Depth Answer (H2)

Explain the topic clearly in a conversational, expert style.

Use 1–2 short paragraphs.

4. Why This Happens / Why It Matters (H2)

Break down the mechanisms, causes, or reasoning behind the question.

Use H3s if needed.

5. Research-Backed Key Points (H2)

A bullet-point section summarizing the top evidence.

Each bullet must be one specific research finding, not generic statements.

Example bullets:

A 2022 study in JAMA found that…

According to NIH metabolic data…

A meta-analysis of 23 trials showed…

6. Practical Tips (H2)

Actionable steps or advice related to the question.

Make these useful, concise, and implementable.

7. Common Myths or Mistakes (H2)

Clarify misconceptions or errors people make.

2–5 items.

8. When to Seek Help / Warning Signs (H2)

Only include if relevant (health, pets, parenting, relationships, etc.).

If irrelevant, omit this section entirely.

9. FAQs (H2)

Generate 3–4 related FAQs, each with a 2–4 sentence answer.

Do NOT repeat content from the article.

10. Sources (H2)

Provide 5–10 reputable sources:

PubMed

NIH

CDC

WHO

Mayo Clinic

Cleveland Clinic

Harvard Health

Journals

Government sites

NO blogs, no commercial sites, no Wikipedia.

📌 WRITING STYLE REQUIREMENTS

Use this style throughout:

Clear

Neutral

Helpful

Evidence-driven

No opinions

No dramatic hype

No unnecessary storytelling

No fluff sentences

No overexplaining basic concepts

Vary sentence length slightly for readability

Tone = "friendly expert."

📌 INTERNAL LINK SIGNALS (NEW UPGRADED FEATURE)

Inside the article body, naturally insert 2–4 contextual internal link prompts like:

"See related: [how posture affects neck pain]"

"Related answer: [best ways to build consistency]"

Write them EXACTLY like this → [[internal_link: question_slug_here]]

Do NOT make up slugs.

Just write:

[[internal_link: TOPIC NAME (not slug)]]

The system will automatically resolve them.

Example:

[[internal_link: benefits of walking after meals]]

📌 TAG GENERATION (IMPORTANT)

At the end, output a JSON object only, like:

{
  "short_answer": "...",
  "summary": "...",
  "verdict": "...",
  "tags": ["sleep", "caffeine", "circadian rhythm"],
  "sources": ["https://pubmed....", "..."]
}

Tags must be 3–7 short phrases

Sources must be actual scientific sources, not placeholders

📌 ABSOLUTE DON'TS

❌ Do NOT use fluff

❌ Do NOT repeat information

❌ Do NOT exceed 900 words

❌ Do NOT include generic filler like "In today's world…"

❌ Do NOT speak in first person

❌ Do NOT write disclaimers like "I am not a doctor"

❌ Do NOT use emojis

❌ Do NOT cite Wikipedia

📌 FINAL OUTPUT FORMAT (REQUIRED)

Full article (Markdown)

JSON metadata block (exactly as shown)

No commentary. No explanations before or after.

Just article → metadata.

---

Proposed Question: ${proposedQuestion}
Category: ${category}
${tagsArray.length > 0 ? `Tags: ${tagsArray.join(', ')}` : ''}
${notes ? `Additional Context: ${notes}` : ''}

Generate the article following the structure above. Output your response as JSON with this exact structure:
{
  "question": "The refined, clear question text",
  "slug": "url-friendly-slug-here",
  "short_answer": "2-4 sentence summary",
  "verdict": "works|doesnt_work|mixed",
  "summary": "2-3 paragraph summary",
  "body_markdown": "Full markdown article following the exact structure above (600-900 words)",
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

  const response = await getOpenAIClient().chat.completions.create({
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
      parsed.tags = tagsArray;
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
