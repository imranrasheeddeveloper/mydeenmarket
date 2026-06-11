"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Users, BookMarked, Sparkles } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  target: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { icon: <Package className="w-7 h-7" />, target: 5000, suffix: "+", label: "Books Available" },
  { icon: <Users className="w-7 h-7" />, target: 10000, suffix: "+", label: "Happy Customers" },
  { icon: <BookMarked className="w-7 h-7" />, target: 500, suffix: "+", label: "Authors" },
  { icon: <Sparkles className="w-7 h-7" />, target: 50, suffix: "+", label: "Categories" },
];

function CountUp({ target, suffix, trigger }: { target: number; suffix: string; trigger: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [trigger, target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="relative group text-center p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-[#C5A44E]/10 hover:border-[#C5A44E]/30 transition-all duration-500 hover:bg-white/10"
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C5A44E]/20 to-[#C5A44E]/5 flex items-center justify-center text-[#E8D5A3] group-hover:scale-110 transition-transform duration-500 border border-[#C5A44E]/15">
            {stat.icon}
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            <CountUp target={stat.target} suffix={stat.suffix} trigger={triggered} />
          </div>
          <p className="text-sm text-[#E8D5A3]/70 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
