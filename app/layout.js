import { Inter } from 'next/font/google';
import './globals.css';
import { Chatbot } from '@/components/Chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bail Recognizer System',
  description: 'Legal case management and bail eligibility analysis system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}