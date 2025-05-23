import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ProgressBar from '@/components/ProgressBar';
import "./globals.css";
import FirstLoading from '@/components/FirstLoading'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MGM",
  description: "MGM - FITNESS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FirstLoading>
          {children}
          <ProgressBar />
        </FirstLoading>
      </body>
    </html>
  );
}
