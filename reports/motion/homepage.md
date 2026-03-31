# Homepage motion report

- element: hero media plane
  trigger: initial presence and light hover/scroll drift
  start/end range: 0% to 25% viewport progress
  purpose: keep the hero feeling alive without adding more labels or chrome
  fallback when reduced motion is enabled: static media, no drift

- element: workflow progression
  trigger: section scroll progression
  start/end range: 25% to 60% viewport progress
  purpose: show the run moving from brief to output without animating the body copy
  fallback when reduced motion is enabled: static section transitions

- element: command center route map
  trigger: section entry and hover emphasis
  start/end range: 55% to 85% viewport progress
  purpose: make route mapping legible without turning the whole surface into a dashboard animation
  fallback when reduced motion is enabled: static route indicators

Max visible animated elements observed: 1
Reduced-motion max visible animated elements observed: 0
