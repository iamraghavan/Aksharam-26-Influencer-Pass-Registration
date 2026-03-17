import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aksharam'26 Influencer Pass",
  description: "Influencer pass registration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script 
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDfUl7G2CIfkJdCRwakYUQeen2o5cCzcVE&libraries=places" 
          strategy="beforeInteractive" 
        />
        {children}
      </body>
    </html>
  );
}
