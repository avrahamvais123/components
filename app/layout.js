import { Geist, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/customized/header/Header";
import Footer4 from "@/components/footer/Footer4";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const NotoSans = Noto_Sans_Hebrew({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "ספריית רכיבים",
  description: "רכיבים מותאמים אישית",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${NotoSans.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
          <Footer4 />
        </Providers>
      </body>
    </html>
  );
}
