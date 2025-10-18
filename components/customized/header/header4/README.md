# Header4

Header פשוט ורספונסיבי עם:
- לוגו
- 4 קישורים
- אווטאר/כפתור התחברות בסוף
- תפריט מובייל בעזרת Sheet

שימוש:

```jsx
import Header4 from "@/components/customized/header/header4/Header4";

export default function Layout({ children }) {
  return (
    <html dir="rtl">
      <body>
        <Header4 />
        {children}
      </body>
    </html>
  );
}
```
