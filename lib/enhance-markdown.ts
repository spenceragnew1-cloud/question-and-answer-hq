import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface EnhanceMarkdownOptions {
  currentMarkdown: string;
  question: string;
  evidence?: Array<{ title: string; url: string; explanation: string }>;
  sources?: string[];
}

export async function enhanceMarkdown({
  currentMarkdown,
  question,
  evidence = [],
  sources = [],
}: EnhanceMarkdownOptions): Promise<string> {
  // Build list of available sources for linking
  const sourceList = [
    ...evidence.map((e) => `- ${e.title}: ${e.url}`),
    ...sources.map((url) => `- ${url}`),
  ].join('\n');

  const prompt = `You are a markdown formatting expert. Enhance the following markdown content with better structure, spacing, and hyperlinks.

Question: ${question}

Current markdown content:
${currentMarkdown}

Available sources to link (use these URLs when mentioning research):
${sourceList || 'No sources provided'}

Requirements:
1. Improve heading structure - use proper H2 and H3 headings to organize content
2. Add proper spacing between sections (blank lines between paragraphs and sections)
3. Convert any plain text URLs to markdown links [text](url)
4. When mentioning research, studies, or sources, create hyperlinks using the available sources above
5. Use proper markdown formatting:
   - **bold** for emphasis
   - *italic* for subtle emphasis
   - Bullet lists for key points
   - Numbered lists for steps or sequences
   - Blockquotes for important quotes or findings
6. Ensure all research articles mentioned in the text are hyperlinked
7. Maintain the same factual content - only improve formatting and add links
8. Add clear section breaks with H2 headings for major topics
9. Use H3 headings for subsections

Return ONLY the enhanced markdown content, nothing else.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a markdown formatting expert. Always return clean, well-formatted markdown with proper headings, spacing, and hyperlinks.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3, // Lower temperature for more consistent formatting
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  // Clean up the response (remove any markdown code blocks if present)
  let enhanced = content.trim();
  if (enhanced.startsWith('```markdown')) {
    enhanced = enhanced.replace(/^```markdown\n?/, '').replace(/\n?```$/, '');
  } else if (enhanced.startsWith('```')) {
    enhanced = enhanced.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }

  return enhanced.trim();
}

