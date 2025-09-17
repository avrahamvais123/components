"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { listVariants, itemVariants } from "./animationConfig";
import { cn } from "@/lib/utils";

const MegaMenueItems = ({ current, setIsOpen }) => {
  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        current?.hero?.image ? "lg:col-span-3" : "col-span-full",
        "h-fit grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3"
      )}
    >
      {current?.items?.map((item, idx) => (
        <motion.li
          key={item?.label ?? idx}
          variants={itemVariants}
          className="group rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 p-3 lg:p-4"
        >
          <Link
            href={{ pathname: "/products", query: { name: item.label } }}
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 leading-6">
                {item?.label}
              </h4>
              <span className="opacity-0 group-hover:opacity-100 transition text-zinc-400">
                ↖︎
              </span>
            </div>
            {item?.description && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 leading-5">
                {item.description}
              </p>
            )}
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default MegaMenueItems;
