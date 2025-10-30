import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chatbot AI - Next.js & Vercel AI SDK',
  description: 'Chatbot inteligente usando Next.js, Vercel AI SDK y OpenRouter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
