export const CATEGORIES = [
  'general_health',
  'nutrition',
  'fitness',
  'sleep',
  'mental_health',
  'medicine',
  'running',
  'parenting',
  'relationships',
  'cooking',
  'cleaning',
  'home_improvement',
  'science',
  'geography',
  'wildlife',
  'nature',
  'technology',
  'productivity',
  'self_improvement',
  'money',
  'travel',
  'lifestyle',
  'general_knowledge',
] as const;

export type Category = (typeof CATEGORIES)[number];

export function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isValidCategory(category: string): category is Category {
  return CATEGORIES.includes(category as Category);
}

export function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    general_health: 'Explore evidence-based answers to general health questions, covering wellness practices, preventive care, and common health concerns.',
    nutrition: 'Discover research-backed insights about food, diet, supplements, and nutritional science to support your health goals.',
    fitness: 'Learn about exercise, training methods, workout effectiveness, and fitness strategies backed by scientific research.',
    sleep: 'Find answers about sleep quality, sleep hygiene, sleep disorders, and evidence-based strategies for better rest.',
    mental_health: 'Explore mental wellness, psychological health, therapy approaches, and research-supported mental health practices.',
    medicine: 'Get research-backed information about medical treatments, medications, procedures, and healthcare approaches.',
    running: 'Discover evidence-based answers about running techniques, training, injury prevention, and performance optimization.',
    parenting: 'Find research-supported guidance on child development, parenting strategies, and evidence-based child-rearing practices.',
    relationships: 'Explore evidence-based insights about communication, relationship dynamics, conflict resolution, and interpersonal connections.',
    cooking: 'Learn about cooking techniques, food preparation methods, kitchen science, and culinary best practices.',
    cleaning: 'Discover research-backed cleaning methods, household maintenance, and effective home care strategies.',
    home_improvement: 'Find evidence-based answers about DIY projects, home repairs, renovation techniques, and household upgrades.',
    science: 'Explore scientific discoveries, research findings, and evidence-based explanations of natural phenomena.',
    geography: 'Learn about places, cultures, geographical features, and location-based knowledge from around the world.',
    wildlife: 'Discover information about animals, ecosystems, conservation, and wildlife behavior based on scientific research.',
    nature: 'Explore natural phenomena, environmental science, outdoor activities, and evidence-based nature knowledge.',
    technology: 'Find research-backed answers about tech products, software, digital tools, and technology best practices.',
    productivity: 'Discover evidence-based productivity methods, time management strategies, and efficiency techniques.',
    self_improvement: 'Explore personal development strategies, self-help approaches, and research-backed self-improvement practices.',
    money: 'Learn about personal finance, investing, saving strategies, and evidence-based financial advice.',
    travel: 'Discover travel tips, destination information, travel planning strategies, and location-specific insights.',
    lifestyle: 'Explore lifestyle choices, daily habits, wellness practices, and evidence-based lifestyle optimization.',
    general_knowledge: 'Browse a wide range of research-backed answers to common questions across various topics and subjects.',
  };

  return descriptions[category] || `Explore questions and answers in the ${formatCategoryName(category)} category.`;
}

