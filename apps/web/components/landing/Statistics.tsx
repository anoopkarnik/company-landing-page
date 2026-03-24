"use client"
import { StatisticsProps } from "@/lib/ts-types/landing";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { StaggerItem } from "@workspace/ui/components/custom/AnimatedSection";
import { Users, Mail, Download, Package } from "lucide-react";

const AnimatedNumber = ({
  value,
  label,
  icon,
}: {
  value: string | number | undefined;
  label: string;
  icon: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    if (value === undefined || value === null) {
      setDisplayValue("0");
      return;
    }

    const strValue = String(value);
    const numericMatch = strValue.match(/[\d,]+/);
    if (!numericMatch) {
      setDisplayValue(strValue);
      return;
    }

    const targetNum = parseInt(numericMatch[0].replace(/,/g, ""), 10);
    if (isNaN(targetNum)) {
      setDisplayValue(strValue);
      return;
    }

    const prefix = strValue.slice(0, strValue.indexOf(numericMatch[0]));
    const suffix = strValue.slice(strValue.indexOf(numericMatch[0]) + numericMatch[0].length);
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
    <StaggerItem>
      <div
        ref={ref}
        className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
          {icon}
        </div>
        <span className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">
          {displayValue}
        </span>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
    </StaggerItem>
  );
};

export const Statistics = ({ users, subscribers, products, downloads }: StatisticsProps) => {
  return (
    <section id="statistics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
        <AnimatedNumber value={users} label="Users" icon={<Users className="w-5 h-5" />} />
        <AnimatedNumber value={subscribers} label="Subscribers" icon={<Mail className="w-5 h-5" />} />
        <AnimatedNumber value={downloads} label="Downloads" icon={<Download className="w-5 h-5" />} />
        <AnimatedNumber value={products} label="Products" icon={<Package className="w-5 h-5" />} />
      </div>
    </section>
  );
};
