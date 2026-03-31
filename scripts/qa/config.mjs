export const qaRoutes = [
  { key: "home", path: "/", label: "Homepage", public: true, flagship: true },
  {
    key: "command-center",
    path: "/app/command-center",
    label: "Command Center",
    public: false,
    flagship: true,
  },
  { key: "sample-runs", path: "/sample-runs", label: "Sample Runs", public: true, flagship: false },
  {
    key: "sample-run-detail",
    path: "/sample-runs/cobalt-travel-charger",
    label: "Sample Run Detail",
    public: true,
    flagship: false,
  },
  { key: "pricing", path: "/pricing", label: "Pricing", public: true, flagship: false },
  { key: "journal", path: "/journal", label: "Journal", public: true, flagship: false },
  {
    key: "journal-detail",
    path: "/journal/why-creative-approval-belongs-before-generation",
    label: "Journal Detail",
    public: true,
    flagship: false,
  },
  { key: "case-studies", path: "/case-studies", label: "Case Studies", public: true, flagship: false },
  {
    key: "case-study-detail",
    path: "/case-studies/northstar-launch-system",
    label: "Case Study Detail",
    public: true,
    flagship: false,
  },
];

export const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-1024", width: 1024, height: 1366 },
  { name: "desktop-1280", width: 1280, height: 960 },
  { name: "desktop-1440", width: 1440, height: 1080 },
];

export const performanceThresholds = {
  home: 0.7,
  "command-center": 0.68,
  "sample-runs": 0.68,
  "sample-run-detail": 0.68,
  pricing: 0.68,
  journal: 0.68,
  "journal-detail": 0.68,
  "case-studies": 0.68,
  "case-study-detail": 0.68,
};

export const bannedPhrases = [
  "hero bottle",
  "texture macro",
  "application close-up",
  "launch tray",
  "offer insert",
  "bundle crop",
  "lead scene",
  "placeholder",
  "proof layer",
  "search depth belongs here",
  "concise path to buy",
  "structured like a serious operating system",
  "the strongest section on the site should also be the most believable",
  "proof pages should read like evidence, not filler",
  "product hero still",
  "packaging still",
  "hand-held product still",
  "campaign preview frame",
  "product bottle cutout",
  "macro texture still",
  "architecture frame",
  "lobby still",
  "shadow plate",
  "swappable later",
  "visual anchor",
  "asset placeholder",
  "phone mockup",
  "laptop/browser mockup",
].map((phrase) => phrase.toLowerCase());

export const flowExpectations = {
  home: [
    { name: "Open Workspace", href: "/app" },
    { name: "Watch Sample Run", href: "/sample-runs/cobalt-travel-charger" },
    { name: "Review pricing", href: "/pricing" },
  ],
  "command-center": [
    { name: "Dashboard", href: "/app" },
    { name: "Project Detail", href: "/app/projects/aster-house-launch" },
    { name: "Sample Run Detail", href: "/sample-runs/cobalt-travel-charger" },
  ],
  "sample-runs": [
    { name: "Northstar Serum Launch", href: "/sample-runs/northstar-serum-launch" },
    { name: "Atelier Summer Layering", href: "/sample-runs/atelier-summer-layering" },
  ],
  "sample-run-detail": [
    { name: "Build a run like this", href: "/contact" },
    { name: "Back to sample runs", href: "/sample-runs" },
  ],
  pricing: [
    { name: "Set up launch credits", href: "/contact" },
    { name: "Talk to enterprise", href: "/enterprise" },
  ],
  journal: [
    { name: "Storyboards are where ad quality gets saved or lost", href: "/journal/storyboards-save-or-lose-ad-quality" },
  ],
  "journal-detail": [{ name: "Back to journal", href: "/journal" }],
  "case-studies": [
    { name: "Northstar turned a sparse asset set into a disciplined launch system", href: "/case-studies/northstar-launch-system" },
  ],
  "case-study-detail": [{ name: "Back to case studies", href: "/case-studies" }],
};
