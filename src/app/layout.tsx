import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZenBlock - Digital Self-Discipline",
  description: "Reclaim control of your time through forced intervention and visual reflection",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
