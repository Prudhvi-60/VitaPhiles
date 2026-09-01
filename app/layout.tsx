import './globals.css';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'VitaPhiles',
  description: 'Movies, books, stories worth remembering.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#090b0d] text-[#f5efe7]">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
