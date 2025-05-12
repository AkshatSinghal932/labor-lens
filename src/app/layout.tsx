import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import MainLayout from '@/components/MainLayout';
import { useEffect } from 'react';
import { seedInitialData } from '@/lib/seedDatabase';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Labour Lens',
  description: 'Report and track labour exploitation issues in your locality.',
};

function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This should ideally be run once, perhaps via an admin panel or a script.
    // Running it in layout ensures data is there for development.
    // Ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set before calling seed.
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
       seedInitialData();
    } else {
      console.warn("Firebase Project ID not set. Skipping data seeding.");
    }
  }, []);
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <AppInitializer>
            <MainLayout>
              {children}
            </MainLayout>
          </AppInitializer>
        </LanguageProvider>
      </body>
    </html>
  );
}
