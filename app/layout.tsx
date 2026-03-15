import type { Metadata } from 'next';
import { Playfair_Display, Manrope } from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CarCo - Luxury Car Rental',
  description: 'Experience the pinnacle of automotive luxury.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
        <body className="font-sans antialiased bg-[#fcfaf8] text-[#1A1714]" suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
