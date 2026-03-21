"use client";

import { useReportWebVitals } from "next/web-vitals";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];
type WebVitalMetric = ReportWebVitalsCallback extends (metric: infer Metric) => void ? Metric : never;

export function WebVitals() {
  useReportWebVitals((metric: WebVitalMetric) => {
    if (typeof window === "undefined") {
      return;
    }

    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating,
      navigationType: metric.navigationType,
      pathname: window.location.pathname,
      ts: Date.now(),
    });

    if ("sendBeacon" in navigator) {
      navigator.sendBeacon("/api/web-vitals", body);
      return;
    }

    void fetch("/api/web-vitals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  });

  return null;
}
