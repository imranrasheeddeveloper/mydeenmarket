"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Users, BookMarked, Sparkles } from "lucide-react";

interface Stat { icon: React.ReactNode; target: number; suffix: string; label: string; }

const stats: Stat[] = [
  { icon: <Package className="w-6 h-6" />, target: 5000, suffix: "+", label: "Books Available" },
  { icon: <Users className="w-6 h-6" />, target: 10000, suffix: "+", label: "Happy Customers" },
  { icon: <BookMarked className="w-6 h-6" />, target: 500, suffix: "+", label: "Authors" },
  { icon: <Sparkles className="w-6 h-6" />, target: 50, suffix: "+", label: "Categories" },
];

function CountUp({ target, suffix, trigger }: { target: number; suffix: string; trigger: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const duration = 2000;
    const startTime = performance.now();
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [trigger, target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.unobserve(el); } }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
      {stats.map((stat, i) => (
        <div key={stat.label} className="text-center p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#d4a853]/15 transition-all duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853]">
            {stat.icon}
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-1.5 tracking-tight">
            <CountUp target={stat.target} suffix={stat.suffix} trigger={triggered} />
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-wide">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
