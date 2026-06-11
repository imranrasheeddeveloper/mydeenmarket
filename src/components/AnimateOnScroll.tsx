"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Animation = "fade-up" | "fade-left" | "fade-right" | "scale" | "fade";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: Animation;
}

const animationClasses: Record<Animation, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  scale: {
    hidden: "opacity-0 scale-90",
    visible: "opacity-100 scale-100",
  },
  fade: {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
};

export default function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { hidden, visible } = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? visible : hidden} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
