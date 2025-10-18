"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-background to-muted/40">
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* תוכן טקסטואלי */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              מחשבון אסטרולוגיה מתקדם
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              גלו תובנות מדויקות על המפה האסטרולוגית שלכם באמצעות חישובים מתקדמים, ממשק נוח, והסברים ברורים בעברית. השירות שלנו משלב דיוק אסטרונומי עם חוויית משתמש אלגנטית ומהירה.
            </p>
          </div>

          <ul className="grid gap-3 text-sm md:text-base text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block size-2 rounded-full bg-primary"></span>
              חישוב מפה אסטרולוגית מלאה לפי תאריך, שעה ומקום לידה
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block size-2 rounded-full bg-primary"></span>
              פרשנות קריאה ידידותית: מזלות, בתים, היבטים ועוד
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block size-2 rounded-full bg-primary"></span>
              ממשק מהיר ותומך בנייד, עם דיוק חישובי גבוה
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/astro" title="התחל חישוב מפה אסטרולוגית">
                התחל חישוב
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#learn-more" title="למידע נוסף על השירות">
                למידע נוסף
              </Link>
            </Button>
          </div>
        </div>

        {/* מקום לתמונה (Placeholder) */}
        <div className="relative">
          <div
            aria-label="מקום לתמונה"
            className="rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/50 aspect-[16/11] w-full shadow-sm overflow-hidden flex items-center justify-center"
          >
            <div className="text-center px-6">
              <div className="mb-3 text-sm font-medium text-muted-foreground">
                מקום לתמונה
              </div>
              <p className="text-xs text-muted-foreground/80">
                השאירו כאן תמונה מותגית יפה של השירות שלכם. מומלץ יחס 16:11, רזולוציה גבוהה, ורקע נקי.
              </p>
            </div>
          </div>

          {/* אלמנט דקורטיבי עדין */}
          <div className="pointer-events-none absolute -inset-2 -z-10 blur-2xl opacity-40 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl" />
        </div>
      </section>

      {/* מקטע מידע נוסף */}
      <section id="learn-more" className="container mx-auto max-w-6xl px-4 md:px-6 pb-16 md:pb-24">
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          <FeatureCard
            title="דיוק מדעי"
            text="עובדים עם נתוני אפמרידים מדויקים והמרות אסטרונומיות כדי להבטיח תוצאות אמינות בכל חישוב."
          />
          <FeatureCard
            title="חוויית שימוש"
            text="ממשק ידידותי, קריא בעברית, מגיב לכל מסך, ומוביל אתכם שלב-אחר-שלב לתוצאה."
          />
          <FeatureCard
            title="הסברים מובנים"
            text="הסברים תמציתיים וברורים לכל מרכיב במפה – מזלות, בתים, שליטים והיבטים מרכזיים."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground p-6">
      <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
