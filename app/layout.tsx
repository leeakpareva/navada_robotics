import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.navadarobotics.com"),
  title: "NAVADA x Booster Robotics | Official Booster Robotics Partner, UK",
  description:
    "NAVADA is the official UK partner for Booster Robotics. Humanoid robots supplied, set up and supported in the United Kingdom, with applied AI built by NAVADA.",
  openGraph: {
    title: "NAVADA x Booster Robotics",
    description: "Official Booster Robotics Partner, UK. Humanoid robots and applied AI.",
    images: ["/hero.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={GeistSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
