"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function MarketingNavLinks({
  items,
}: {
  items: Array<{ href: string; label: string }>;
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn("site-nav-link", active && "is-active")}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function JourneyRail({
  items,
  label = "Journey",
  className,
}: {
  items: Array<{ id: string; label: string }>;
  label?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!targets.length) {
      return;
    }

    const updateFromScroll = () => {
      const winner = targets
        .map((target) => {
          const rect = target.getBoundingClientRect();
          const distance = Math.abs(rect.top - window.innerHeight * 0.24);
          return { id: target.id, distance, top: rect.top };
        })
        .sort((a, b) => a.distance - b.distance || a.top - b.top)[0];

      if (winner?.id) {
        setActiveId(winner.id);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement) {
          setActiveId(visible.target.id);
          return;
        }

        updateFromScroll();
      },
      {
        rootMargin: "-26% 0px -52% 0px",
        threshold: [0.12, 0.3, 0.55, 0.8],
      },
    );

    targets.forEach((target) => observer.observe(target));

    if (!reducedMotion.matches) {
      updateFromScroll();
      window.addEventListener("scroll", updateFromScroll, { passive: true });
      window.addEventListener("resize", updateFromScroll);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [items]);

  const activeIndex = useMemo(() => {
    const index = items.findIndex((item) => item.id === activeId);
    return index === -1 ? 0 : index;
  }, [activeId, items]);

  const progress = items.length > 1 ? activeIndex / (items.length - 1) : 0;

  return (
    <nav
      className={cn("journey-rail", className)}
      aria-label={label}
      style={{ "--journey-progress": String(progress) } as CSSProperties}
    >
      <div className="journey-rail__frame">
        <p className="journey-rail__label">{label}</p>
        <div className="journey-rail__track" aria-hidden="true">
          <span />
        </div>
        <div className="journey-rail__links">
          {items.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "journey-rail__link",
                activeId === item.id && "is-active",
                index <= activeIndex && "is-complete",
              )}
            >
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  id,
  as = "div",
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  as?: "div" | "section" | "article";
  variant?: "rise" | "mask";
}) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.18,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      id={id}
      ref={ref as never}
      data-reveal={visible ? "visible" : "hidden"}
      className={cn("scroll-reveal", variant === "mask" && "scroll-reveal--mask", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
