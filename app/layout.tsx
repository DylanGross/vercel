import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Todo Manager - Gestiona tus tareas con IA',
  description: 'Gestor de tareas inteligente con interfaz conversacional usando Next.js, Vercel AI SDK, y OpenRouter',
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
