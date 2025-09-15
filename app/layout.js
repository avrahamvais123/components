// app/layout.js
import { Rubik, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/customized/header/Header";
import Footer4 from "@/components/footer/Footer4";
import Header2 from "@/components/customized/header/Header2";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik", // אפשר להשאיר, לא חובה בשיטה הזו
});

const notoSans = Noto_Sans_Hebrew({
  // חשוב! שיהיה "hebrew" כדי שיטען גליפים בעברית
  subsets: ["hebrew", "latin"],
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "ספריית רכיבים",
  description: "רכיבים מותאמים אישית",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      {/* פשוט מחילים את הפונט ישירות על ה-body */}
      <body className={`${rubik.className} antialiased`}>
        <Providers>
          <Header2 />
          {children}
          <Footer4 />
        </Providers>
      </body>
    </html>
  );
}
