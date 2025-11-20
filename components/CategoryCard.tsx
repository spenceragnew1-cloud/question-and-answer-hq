import Link from 'next/link';
import { getCategoryBySlug } from '@/lib/categories';

interface CategoryCardProps {
  category: string;
  count?: number;
}

export default function CategoryCard({ category, count }: CategoryCardProps) {
  const categoryDef = getCategoryBySlug(category);
  
  if (!categoryDef) {
    return null;
  }
  
  return (
    <Link href={`/category/${categoryDef.slug}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-teal-50 transition-all p-6 border border-gray-200 cursor-pointer group">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal mb-2">
          {categoryDef.label}
        </h3>
        {count !== undefined && (
          <p className="text-sm text-gray-500">{count} questions</p>
        )}
      </div>
    </Link>
  );
}

