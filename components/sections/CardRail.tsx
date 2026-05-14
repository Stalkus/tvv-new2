"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll rail used for tour-card carousels on all hub pages.
 * Mobile = native scroll; desktop = grid.
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
};

export function CardRail({
  children,
  className,
  asGrid = true,
}: {
  children: ReactNode;
  className?: string;
  asGrid?: boolean;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "-mx-5 flex gap-5 overflow-x-auto scroll-rail scroll-snap-x px-5 pb-3",
        asGrid && "sm:mx-0 sm:overflow-visible sm:px-0 sm:grid sm:grid-cols-2 sm:scroll-snap-none lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardRailItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={cn("w-[280px] shrink-0 scroll-snap-start sm:w-auto", className)}>
      {children}
    </motion.div>
  );
}
