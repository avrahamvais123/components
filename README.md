This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🔒 Secure PayPal Integration

This project includes a **secure** PayPal payment integration with server-side price validation.

### 🛡️ Security Features:
- **Server-side price calculation** - No client-side price manipulation
- **Product catalog validation** - Prices verified against server database
- **Real-time price comparison** - Warns about price mismatches
- **Cart validation** - Stock and product availability checks

### Quick Links
- **Test PayPal**: [http://localhost:3001/paypal-test](http://localhost:3001/paypal-test) (בדיקת PayPal)
- **Checkout**: [http://localhost:3001/checkout](http://localhost:3001/checkout) (עמוד תשלום)

### 📱 Responsive Design:
- **Mobile-first approach** - עיצוב מותאם לכל המכשירים
- **Adaptive layout** - Grid layout בדסקטופ, stack במובייל  
- **Sticky payment button** - כפתור תשלום צף במובייל
- **Collapsible order summary** - סיכום מתקפל לחיסכון במקום

### Documentation:
- [Setup Guide](./PAYPAL_SETUP.md) - הוראות הגדרה מפורטות
- [Security Guide](./SECURITY_IMPROVEMENTS.md) - מדריך אבטחה ושיפורים
- [Responsive Guide](./RESPONSIVE_IMPROVEMENTS.md) - שיפורי רספונסיביות
- [Integration Summary](./PAYPAL_INTEGRATION_SUMMARY.md) - סיכום טכני

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
