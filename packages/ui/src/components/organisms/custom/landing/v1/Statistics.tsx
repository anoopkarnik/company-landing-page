"use client"
import { StatisticsProps } from "@repo/ts-types/landing-page/about";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const AnimatedNumber = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericMatch = value.match(/[\d,]+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(numericMatch[0].replace(/,/g, ""), 10);
    if (isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    const prefix = value.slice(0, value.indexOf(numericMatch[0]));
    const suffix = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length);
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetNum * eased);
      setDisplayValue(`${prefix}${current.toLocaleString()}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="space-y-2 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold">{label}</h2>
      <p className="text-xl text-muted-foreground">{displayValue}</p>
    </motion.div>
  );
};

export const Statistics = ({ users, subscribers, products, downloads }: StatisticsProps) => {
  return (
    <section id="statistics">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <AnimatedNumber value={users} label="Users" />
        <AnimatedNumber value={subscribers} label="Subscribers" />
        <AnimatedNumber value={downloads} label="Downloads" />
        <AnimatedNumber value={products} label="Products" />
      </div>
    </section>
  );
};
