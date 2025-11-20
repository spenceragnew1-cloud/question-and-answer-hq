'use client';

import Link from 'next/link';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

export function Breadcrumbs({ segments, className }: BreadcrumbsProps) {
  if (!segments || segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          // Truncate long labels, especially for the last segment (question title)
          const maxLength = isLast ? 60 : 30;
          const displayLabel =
            segment.label.length > maxLength
              ? `${segment.label.substring(0, maxLength)}...`
              : segment.label;

          return (
            <li key={index} className="flex items-center gap-1">
              {segment.href && !isLast ? (
                <Link
                  href={segment.href}
                  className="hover:text-teal transition-colors"
                  title={segment.label}
                >
                  {displayLabel}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-gray-900 font-medium' : ''}
                  title={segment.label}
                >
                  {displayLabel}
                </span>
              )}
              {!isLast && <span className="text-gray-400">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

