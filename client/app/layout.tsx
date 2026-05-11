import type { Metadata } from "next";
import { Providers } from "./provider";
import { AppToaster } from "@/utils/app-toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Upnixo | High-Performance Engineering",
  description:
    "Scalable Infrastructure, Custom Webhooks, and Real-time Architectures.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
        <AppToaster />
      </body>
    </html>
  );
}
