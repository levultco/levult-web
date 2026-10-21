import type { Lang } from "./i18n";

/**
 * Every product Levult runs. Add an entry here and it appears in the grid,
 * the menu and its own page at /features/[slug], in every language: give it a
 * `text` for each one.
 */

/** What changes with the language. */
export type ProductText = {
  category: string;
  platforms: string;
  /** Where it stands today, e.g. "Disponible" or "Acceso anticipado". */
  status: string;
  /** One line for the card. */
  summary: string;
  /** The opening sentence of its page. */
  lead: string;
  body: string;
  features: { title: string; text: string }[];
  /** An optional list shown as chips on its page (who it is for, what it covers). */
  audience?: { title: string; items: string[] };
  hint?: string;
};

/** What is the same in every language. */
type ProductBase = {
  slug: string;
  name: string;
  kind: "App" | "Web";
  year: string;
  /** The product's own website. */
  url: string;
  /** Which live interface to show; products without one show their stage only. */
  device?: "paryup" | "oposalud";
  /** Brand colours, shown as light glowing behind the device on a dark stage. */
  glow: [string, string, string?];
};

/** A product in one language: its fixed facts plus its text. */
export type Product = ProductBase & ProductText;

const catalog: (ProductBase & { text: Record<Lang, ProductText> })[] = [
  {
    slug: "paryup",
    name: "ParyUp",
    kind: "App",
    year: "2026",
    url: "https://paryup.com/",
    device: "paryup",
    glow: ["#ffc23a", "#e86aae", "#7e4fd0"],
    text: {
      es: {
        category: "Ocio nocturno",
        platforms: "iOS y Android",
        status: "Disponible",
        summary: "Decide tu noche antes de salir: qué hay hoy, quién va y tu entrada en el móvil.",
        lead: "Crea toda tu noche sin dar vueltas.",
        body: "ParyUp conecta lo que pasa en la ciudad con quienes quieren vivirlo ahora. Descubres planes, ves quién va y entras sin fricción. Y para los clubs, Nexus reúne eventos, acceso, equipo, estadísticas y álbumes en un solo lugar.",
        features: [
          { title: "Qué hay hoy", text: "Todo lo que pasa cerca de ti en un solo sitio, para decidir en segundos." },
          { title: "Mapa en tiempo real", text: "Los eventos de tu ciudad en un mapa que se actualiza al momento, para ver qué hay cerca y decidir sobre la marcha." },
          { title: "Sabes quién va", text: "Ves quién va a cada plan y armas tu grupo sin salir de la app." },
          { title: "Matches", text: "Conecta con gente que va a los mismos planes que tú." },
          { title: "Chats", text: "Mensajes directos y de grupo para quedar y organizarte antes de salir." },
          { title: "Entrada con QR", text: "Compras tu entrada y accedes con QR, sin saltar entre plataformas." },
          { title: "Eventos privados", text: "Creas tu evento, invitas a quien quieras y controlas quién entra." },
          { title: "Recap de la noche", text: "Cada salida deja un resumen con fotos, gente y momentos para volver a ella." },
          { title: "Nexus para clubs", text: "Eventos, acceso, equipo, estadísticas y álbumes del club, conectados." },
        ],
        audience: { title: "Para", items: ["Quien sale de noche", "Grupos de amigos", "Clubs y salas", "Eventos privados"] },
        hint: "Desliza los carteles o toca uno cerca de ti.",
      },
      en: {
        category: "Nightlife",
        platforms: "iOS and Android",
        status: "Available",
        summary: "Plan your night before you go out: what's on today, who's going and your ticket on your phone.",
        lead: "Build your whole night without the runaround.",
        body: "ParyUp connects what's happening in the city with the people who want to live it right now. You discover plans, see who's going and walk in without friction. And for clubs, Nexus brings events, access, staff, stats and albums together in one place.",
        features: [
          { title: "What's on today", text: "Everything happening near you in one place, so you can decide in seconds." },
          { title: "Live event map", text: "Your city's events on a map that updates in real time, so you can see what's nearby and decide on the spot." },
          { title: "See who's going", text: "See who's going to each plan and build your group without leaving the app." },
          { title: "Matches", text: "Connect with people who are going to the same plans as you." },
          { title: "Chats", text: "Direct and group messages to meet up and get organised before you go out." },
          { title: "QR tickets", text: "Buy your ticket and get in with a QR code, no jumping between platforms." },
          { title: "Private events", text: "Create your event, invite whoever you want and control who gets in." },
          { title: "Night recap", text: "Every night out leaves a summary with photos, people and moments to relive it." },
          { title: "Nexus for clubs", text: "The club's events, access, staff, stats and albums, all connected." },
        ],
        audience: { title: "For", items: ["People who go out at night", "Groups of friends", "Clubs and venues", "Private events"] },
        hint: "Swipe the posters or tap one near you.",
      },
    },
  },
  {
    slug: "oposalud",
    name: "Oposalud",
    kind: "App",
    year: "2026",
    url: "https://oposalud.app/",
    device: "oposalud",
    glow: ["#0f8f6e", "#2fd3a0"],
    text: {
      es: {
        category: "Educación",
        platforms: "Android · iOS próximamente",
        status: "Acceso anticipado",
        summary: "La oposición sanitaria, pregunta a pregunta.",
        lead: "Cada especialidad, un paso más cerca de tu plaza.",
        body: "Una app para preparar las oposiciones sanitarias con un tutor de IA disponible a cualquier hora, simulacros por comunidad y un banco de preguntas que se mantiene al día.",
        features: [
          { title: "Tutor IA 24/7", text: "Te explica cada pregunta y cada tema cuando lo necesitas, a cualquier hora." },
          { title: "Simulacros por comunidad", text: "Exámenes con el formato del servicio de salud al que te presentas." },
          { title: "Banco actualizado", text: "Preguntas revisadas y al día con la legislación y los temarios." },
        ],
        audience: { title: "Especialidades", items: ["TCAE", "TES", "Técnico/a de Farmacia", "Celador/a", "Enfermería"] },
        hint: "Haz el test: tres preguntas reales de legislación sanitaria.",
      },
      en: {
        category: "Education",
        platforms: "Android · iOS coming soon",
        status: "Early access",
        summary: "The healthcare civil-service exam, one question at a time.",
        lead: "Every specialty, one step closer to your place.",
        body: "An app to prepare for Spain's healthcare civil-service exams (oposiciones) with an AI tutor available at any hour, mock exams by region and a question bank that stays up to date.",
        features: [
          { title: "AI tutor 24/7", text: "Explains every question and every topic whenever you need it, at any hour." },
          { title: "Mock exams by region", text: "Exams in the format of the health service you're applying to." },
          { title: "Always-current question bank", text: "Questions reviewed and up to date with legislation and syllabi." },
        ],
        audience: { title: "Specialties", items: ["TCAE", "TES", "Pharmacy technician", "Hospital porter", "Nursing"] },
        hint: "Take the test: three real health-law questions (in Spanish).",
      },
    },
  },
];

/** Every product, written in `lang`. */
export function getProducts(lang: Lang): Product[] {
  return catalog.map(({ text, ...base }) => ({ ...base, ...text[lang] }));
}

export const getProduct = (slug: string, lang: Lang) => getProducts(lang).find((p) => p.slug === slug);

/** The language-independent facts, for places that only need names, slugs or colours. */
export const productFacts: ProductBase[] = catalog.map(({ text: _text, ...base }) => base);

/** "https://paryup.com/" → "paryup.com" */
export const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");
