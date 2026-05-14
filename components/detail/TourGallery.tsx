"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fallback = [
  "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export function TourGallery({ images = fallback, alt }: { images?: string[]; alt: string }) {
  const main = images[0] ?? fallback[0];
  const thumbs = (images.length > 1 ? images.slice(1) : fallback.slice(1)).slice(0, 4);
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-3 lg:gap-4 sm:grid-cols-[1.6fr,1fr]"
    >
      <motion.div variants={itemVariants} className="relative aspect-[4/3] lg:aspect-[16/10] w-full overflow-hidden rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <Image
          src={main}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-[2s] hover:scale-105"
        />
      </motion.div>
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {thumbs.map((img, i) => (
          <motion.div variants={itemVariants} key={i} className="relative aspect-square w-full overflow-hidden rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <Image
              src={img}
              alt=""
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-[2s] hover:scale-105"
            />
            {i === thumbs.length - 1 && (
              <button className="absolute inset-0 bg-navy/40 flex items-center justify-center backdrop-blur-[2px] transition-colors hover:bg-navy/30">
                <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-navy shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                  +{Math.max(images.length, fallback.length) - 5} More
                </span>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
