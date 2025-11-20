export type CategoryId =
  | 'general_health'
  | 'nutrition'
  | 'sleep'
  | 'fitness_exercise'
  | 'parenting'
  | 'relationships'
  | 'home_cleaning'
  | 'cooking_food'
  | 'money_finance'
  | 'productivity'
  | 'mental_health';

export interface CategoryDef {
  id: CategoryId;
  slug: string;
  label: string;
  description: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'general_health',
    slug: 'general_health',
    label: 'Health & Wellness',
    description: 'Evidence-based answers for health, wellness, and healthy living.',
  },
  {
    id: 'nutrition',
    slug: 'nutrition',
    label: 'Nutrition & Diet',
    description: 'Food, diet, and nutrition questions backed by research.',
  },
  {
    id: 'sleep',
    slug: 'sleep',
    label: 'Sleep',
    description: 'Sleep quality, rest, and recovery science.',
  },
  {
    id: 'fitness_exercise',
    slug: 'fitness_exercise',
    label: 'Fitness & Exercise',
    description: 'Workouts, training, and staying active.',
  },
  {
    id: 'parenting',
    slug: 'parenting',
    label: 'Parenting',
    description: 'Family, raising kids, and parenting science.',
  },
  {
    id: 'relationships',
    slug: 'relationships',
    label: 'Relationships',
    description: 'Communication, connection, and relationship skills.',
  },
  {
    id: 'home_cleaning',
    slug: 'home_cleaning',
    label: 'Home & Cleaning',
    description: 'Cleaning, organizing, and maintaining your home.',
  },
  {
    id: 'cooking_food',
    slug: 'cooking_food',
    label: 'Cooking & Food',
    description: 'Cooking basics, kitchen tips, and food science.',
  },
  {
    id: 'money_finance',
    slug: 'money_finance',
    label: 'Money & Finance',
    description: 'Saving, budgeting, and personal finance advice.',
  },
  {
    id: 'productivity',
    slug: 'productivity',
    label: 'Productivity & Work',
    description: 'Workflows, focus, and productivity strategies.',
  },
  {
    id: 'mental_health',
    slug: 'mental_health',
    label: 'Mental Health & Mindset',
    description: 'Mindset, stress reduction, and psychological well-being.',
  },
];

export function getCategoryById(id?: string): CategoryDef | undefined {
  if (!id) return undefined;
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug?: string): CategoryDef | undefined {
  if (!slug) return undefined;
  return CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

// Legacy helper functions for backward compatibility
export function formatCategoryName(categoryId: string): string {
  const category = getCategoryById(categoryId) || getCategoryBySlug(categoryId);
  return category?.label || categoryId
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isValidCategory(categoryId: string): boolean {
  return !!getCategoryById(categoryId) || !!getCategoryBySlug(categoryId);
}

export function getCategoryDescription(categoryId: string): string {
  const category = getCategoryById(categoryId) || getCategoryBySlug(categoryId);
  return category?.description || `Explore questions and answers in the ${formatCategoryName(categoryId)} category.`;
}