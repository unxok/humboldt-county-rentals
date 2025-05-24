import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/common/Header";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HCR",
  description: "Humboldt County Rentals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <div className="mx-auto lg:max-w-[min(190ch,95vw)]">
            <div className="sticky top-0 z-50">
              <Header />
              <hr className="pb-4" />
            </div>
            <main className="z-10 h-full overflow-auto">{children}</main>
          </div>
          <Toaster richColors toastOptions={{}} />
        </ThemeProvider>
      </body>
    </html>
  );
}
