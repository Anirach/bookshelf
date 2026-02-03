import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookshelf - Personal Book Management",
  description: "Track your reading journey",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <nav className="border-b bg-card">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                  📚 Bookshelf
                </Link>
                <div className="flex gap-4">
                  <Link href="/" className="hover:text-primary">Dashboard</Link>
                  <Link href="/books" className="hover:text-primary">Books</Link>
                  <Link href="/books/new" className="hover:text-primary">Add Book</Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
