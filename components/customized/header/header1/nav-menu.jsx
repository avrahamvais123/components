"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const departments = {
  "מוצרי מזון יבש": [
    "פסטה, אורז ודגנים",
    "קמח וסוכר",
    "קטניות ושימורים",
    "חטיפים וממתקים",
    "קפה, תה ושוקו",
  ],
  "מוצרי חלב": ["חלב ומשקאות חלב", "גבינות", "יוגורטים", "חמאה ומרגרינה"],
  "בשר ודגים": ["בשר טרי", "עוף", "דגים", "מוצרי מעדניה"],
  "פירות וירקות": ["ירקות טריים", "פירות עונתיים", "עשבי תיבול"],
  מאפייה: ["לחמים", "חלות", "עוגות ועוגיות"],
  קפואים: ["ירקות קפואים", "פיצות קפואות", "גלידות וקינוחים"],
  שתייה: ["מים מינרליים", "משקאות קלים", "מיצים", "אלכוהול ובירות"],
  "ניקוי וטואלטיקה": ["חומרי ניקוי לבית", "סבונים ושמפו", "מוצרי היגיינה"],
  "מוצרים לבית": ["כלי פלסטיק ונייר", "סוללות", "כלי מטבח פשוטים"],
};

export const NavMenu = (props) => {
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-1 space-x-0 text-sm">
        {Object.entries(departments).map(([department, items]) => {
          return (
            <NavigationMenuItem key={department}>
              <NavigationMenuTrigger>{department}</NavigationMenuTrigger>
              <NavigationMenuContent className="">
                <ul className="grid w-200">
                  {items.map((item) => (
                    <li key={item}>
                      <NavigationMenuLink className="block select-none rounded-md p-2 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <Link href="#">{item}</Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <props.icon className="mb-4 size-6" />
            <div className="text-sm font-semibold leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";

{
  /* <NavigationMenuItem>
          <Button variant="ghost" asChild>
            <Link href="#">Home</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Food</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-1 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {foods.map((food) => (
                <ListItem
                  key={food.title}
                  title={food.title}
                  icon={food.icon}
                  href="#"
                >
                  {food.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Travel</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-1 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {travelMenuItems.map((menuItem) => (
                <ListItem
                  key={menuItem.title}
                  title={menuItem.title}
                  icon={menuItem.icon}
                  href="#"
                >
                  {menuItem.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */
}
