import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

// Initialize Inter font with Latin subset
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // Optional CSS variable
});

export const metadata: Metadata = {
  title: "Lab Results Management",
  description: "Medical diagnostic test results management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}