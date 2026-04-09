"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimateOnScroll({
  children,
  variant = "fadeUp",
  delay = 0,
  threshold = 0.15,
  duration = 700,
  className = "",
  once = true,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const variants = {
    fadeUp: {
      hidden: { opacity: 0, transform: "translateY(40px)" },
      visible: { opacity: 1, transform: "translateY(0)" },
    },
    fadeDown: {
      hidden: { opacity: 0, transform: "translateY(-40px)" },
      visible: { opacity: 1, transform: "translateY(0)" },
    },
    fadeLeft: {
      hidden: { opacity: 0, transform: "translateX(-40px)" },
      visible: { opacity: 1, transform: "translateX(0)" },
    },
    fadeRight: {
      hidden: { opacity: 0, transform: "translateX(40px)" },
      visible: { opacity: 1, transform: "translateX(0)" },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scaleIn: {
      hidden: { opacity: 0, transform: "scale(0.85)" },
      visible: { opacity: 1, transform: "scale(1)" },
    },
    blurIn: {
      hidden: { opacity: 0, filter: "blur(10px)", transform: "translateY(20px)" },
      visible: { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
    },
  };

  const v = variants[variant] || variants.fadeUp;
  const style = isVisible ? v.visible : v.hidden;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}
