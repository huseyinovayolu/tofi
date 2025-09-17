import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tofi - Schweizer Blumen direkt vom Bauernhof',
  description: 'Entdecken Sie die schönsten Blumen der Schweiz - frisch, regional und nachhaltig angebaut von lokalen Produzenten.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}