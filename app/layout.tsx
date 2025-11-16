import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuestionAndAnswerHQ - Research-Backed Answers',
  description:
    'Get evidence-based answers to your questions. Daily updates with research from PubMed, major institutions, and trusted sources.',
  keywords: 'questions, answers, research, evidence-based, health, science',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://questionandanswerhq.com';

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Question and Answer HQ',
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Question and Answer HQ',
    url: siteUrl,
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgSchema),
          }}
        />
        {/* Global WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              id="ga-setup"
              dangerouslySetInnerHTML={{
                __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            page_path: window.location.pathname,
          });
        `,
              }}
            />
          </>
        )}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

