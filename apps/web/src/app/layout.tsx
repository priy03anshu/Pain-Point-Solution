import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'PlacementOS — Career Intelligence & AI Placement Coach',
  description: 'AI-powered placement preparation platform. Diagnosis → Guidance → Practice → Feedback → Progress for students of any degree.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-blue-500 selection:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
