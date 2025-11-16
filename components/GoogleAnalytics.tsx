'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    
    if (!gaId || typeof window === 'undefined') {
      return;
    }

    // Wait for gtag to be available (with a small delay to ensure script is loaded)
    const trackPageView = () => {
      if (window.gtag) {
        window.gtag('config', gaId, {
          page_path: pathname,
        });
      } else {
        // Retry after a short delay if gtag isn't ready yet
        setTimeout(trackPageView, 100);
      }
    };

    trackPageView();
  }, [pathname]);

  // Only render the GA scripts if GA_ID is set
  if (!process.env.NEXT_PUBLIC_GA_ID) {
    return null;
  }

  return (
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
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

