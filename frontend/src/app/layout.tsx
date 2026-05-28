import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppProviders } from "@/components/layout/app-providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tuskbase — Verifiable Knowledge Agent",
  description:
    "AI research agent with verifiable memory on Walrus, powered by Tatum and Sui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-screen flex flex-col font-sans bg-background text-foreground overflow-hidden">
        <ThemeProvider>
          <AppProviders>
            <TooltipProvider>
              <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {children}
              </main>
            </TooltipProvider>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
