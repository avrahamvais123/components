import { Geist, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/customized/navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const NotoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-NotoSansHebrew",
  subsets: ["latin"],
});

export const metadata = {
  title: "ספריית רכיבים",
  description: "רכיבים מותאמים אישית",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${geistSans.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
