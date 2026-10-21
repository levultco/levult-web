import type { Dict } from "./es";

/** The site's text in English. Same shape as Spanish; the compiler checks it. */
export const en: Dict = {
  meta: {
    title: "Levult — We build what's next",
    tagline: "We build what's next.",
    description:
      "Levult is a technology company that designs, builds and grows its own digital products, like ParyUp and Oposalud. From the first idea to the real world.",
    ogAlt: "Levult — We build what's next",
    ogLines: ["We build", "what's next."],
    ogSub: "Our own digital products, from the first idea to the real world.",
    productOgAlt: "A featured work by Levult",
    notFoundTitle: "Page not found",
    breadcrumbHome: "Home",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Featured", href: "/#destacados" },
    { label: "Company", href: "/#compania" },
    { label: "Contact", href: "/#contacto" },
  ],
  header: {
    homeAria: "Levult, home",
    talk: "Let's talk",
    menu: "Menu",
    close: "Close",
    switchShort: "ES",
    switchAria: "Ver esta página en español",
  },
  menu: {
    aria: "Menu",
    mainAria: "Main menu",
    featured: "Featured work",
  },
  hero: {
    title: "We build what's next.",
    text: "Levult is a technology company that designs, builds and grows its own digital products. From the first idea to the real world.",
    seeWork: "See our work",
    company: "The company",
  },
  statement: {
    title: "How we work",
    text: "The world doesn't need more apps. It needs better ones. We build products that deserve to exist and stay on to help them grow.",
  },
  products: {
    title: "Featured work",
    text: "Apps and sites we design, code and run ourselves, from the first idea to the everyday.",
    viewWork: "View work",
  },
  company: {
    title: "We build to stay.",
    text: "Levult designs, builds and runs its own digital products. We launch less, but look after each one for years.",
    principles: [
      { title: "Our own products", text: "Everything we launch is ours, and we keep it alive." },
      { title: "We use it ourselves", text: "If we wouldn't open it every day, it doesn't go out the door." },
      { title: "We measure in people", text: "People who come back, plans that come true, exam places that are won. The rest is noise." },
    ],
  },
  contact: {
    title: "Shall we talk?",
    text: "Write to us if you'd like to talk about any of our products, work with us or join the team.",
    press: "Press",
    collaborate: "Collaborate",
    work: "Work here",
    subjectPress: "Press · Levult",
    subjectCollaborate: "Collaboration · Levult",
    subjectWork: "Working at Levult",
  },
  footer: {
    navigation: "Navigation",
    featured: "Featured",
    tagline: "Levult creates, launches and grows its own digital products.",
    legal: "Legal notice",
    privacy: "Privacy",
  },
  legalPage: {
    updated: "Last updated",
    updatedDate: "October 21, 2026",
    index: "On this page",
    pending: "pending",
    notice: {
      title: "Legal notice",
      lead: "Who owns this website and the terms on which you can use it. Courtesy translation: the Spanish version prevails in case of any discrepancy.",
    },
    privacy: {
      title: "Privacy and cookies",
      lead: "What data we process, why, and how to exercise your rights. This website uses no cookies or analytics. Courtesy translation: the Spanish version prevails in case of any discrepancy.",
    },
  },
  product: {
    back: "Featured work",
    facts: { kind: "Type", category: "Category", platforms: "Platforms", status: "Status" },
    visit: "Visit {domain}",
    running: "{name} in action",
    whatItDoes: "What it does",
    webOf: "{name}'s website",
    visitWeb: "Visit site",
    next: "Next work",
    nextAria: "Next work: {name}",
    viewWork: "View work",
    titleSuffix: "Levult",
    description: "{summary} {kind} in {category}, created by Levult.",
  },
  notFound: {
    code: "Error 404",
    title: "This page got away from us.",
    text: "The link may be broken or the page may have moved. Go back home, or head straight to one of our works.",
    home: "Back to home",
  },
};
