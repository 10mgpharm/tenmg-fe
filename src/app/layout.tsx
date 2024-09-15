import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import config from "@/lib/config";
import TenmgLogo from "@public/assets/images/tenmg_logo.png";
import TenmgLogoThumbnailImage from "@public/assets/images/tenmg_logo.png";
import Provider from "./provider";

const fontSans = Lato({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
});

const appName = config.appName;
const appUrl = config.appUrl;
const appMetaTitle = `${appName} - Providing Credit score and commerce for Pharmacist and Health Providers`;
const imageAlt = '10MG Health Logo';
const appMetaDescription =
  "📢 Providing Credit score and commerce for Pharmacist and Health Providers. #10MG #Health #CreditScore #CreditVoucher #Pharmacist #HealthProviders";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: appMetaTitle,
  description: appMetaDescription,
  authors: {
    url: appUrl,
    name: appName,
  },
  openGraph: {
    type: "website",
    url: appUrl,
    title: appMetaTitle,
    description: appMetaDescription,
    images: [
      {
        url: TenmgLogoThumbnailImage.src,
        alt: imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appMetaTitle,
    description: appMetaDescription,
    images: [
      {
        url: TenmgLogoThumbnailImage.src,
        alt: imageAlt,
      },
    ],
  },
  robots: {
    index: true,
    follow: false,
  },
  icons: [
    {
      url: TenmgLogo.src,
      type: "image/png",
      sizes: "32x32",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='light' suppressHydrationWarning>
      <head>
        <link rel="icon" href={TenmgLogo.src} type="image/png" sizes="32x32" />
      </head>
      <body
        className={cn(fontSans.variable)}
        suppressHydrationWarning
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}