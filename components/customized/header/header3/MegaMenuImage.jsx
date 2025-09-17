"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const MegaMenuImage = ({ current, setIsOpen }) => {
  return (
    <div>
      {current?.hero?.image && (
        <motion.aside
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="order-first lg:order-none lg:col-span-1"
          aria-hidden={false}
        >
          <Link
            href={current.hero?.ctaHref || "#"}
            className="group block h-full"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-full aspect-[16/9] lg:aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <Image
                src={current.hero.image}
                alt={current.hero.alt || ""}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, 100vw"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 text-white">
                {current.hero.eyebrow && (
                  <span className="inline-block text-xs/none px-2 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                    {current.hero.eyebrow}
                  </span>
                )}
                {current.hero.title && (
                  <h3 className="mt-2 text-lg font-semibold drop-shadow">
                    {current.hero.title}
                  </h3>
                )}
                {current.hero.ctaLabel && (
                  <span className="mt-2 inline-flex items-center gap-1 text-sm underline underline-offset-4 decoration-white/60 group-hover:decoration-white">
                    {current.hero.ctaLabel} <span aria-hidden>↗</span>
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.aside>
      )}
    </div>
  );
};

export default MegaMenuImage;
