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

