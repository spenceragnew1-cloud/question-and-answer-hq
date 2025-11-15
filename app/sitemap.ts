import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://questionandanswerhq.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  // Homepage
  urls.push({
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  // Questions index
  urls.push({
    url: `${SITE_URL}/questions`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // Category pages
  for (const category of CATEGORIES) {
    urls.push({
      url: `${SITE_URL}/category/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Published questions
  const { data: questions } = await supabase
    .from('questions')
    .select('slug, updated_at')
    .eq('status', 'published');

  if (questions) {
    for (const question of questions) {
      urls.push({
        url: `${SITE_URL}/questions/${question.slug}`,
        lastModified: question.updated_at ? new Date(question.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return urls;
}

