import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Planner",
  description: "Ứng dụng quản lý chi tiêu cá nhân",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b">
            <nav className="mx-auto flex w-full max-w-4xl items-center justify-between p-4">
              <div className="flex items-center gap-6 font-medium">
                <Link href="/dashboard" className="font-bold">
                  Finance Planner
                </Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/transactions">Giao dịch</Link>
                <Link href="/wishlist">Wishlist</Link>
              </div>
              <ThemeToggle />
            </nav>
          </header>

          <div className="mx-auto w-full max-w-4xl flex-1">{children}</div>

          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}