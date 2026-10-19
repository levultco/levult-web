/**
 * Every product Levult runs. Add an entry here and it appears in the grid,
 * the menu and its own page at /features/[slug].
 */
export type Product = {
  slug: string;
  name: string;
  kind: "App" | "Web";
  category: string;
  year: string;
  platforms: string;
  /** Where it stands today, e.g. "Disponible" or "Acceso anticipado". */
  status: string;
  /** The product's own website. */
  url: string;
  /** One line for the card. */
  summary: string;
  /** The opening sentence of its page. */
  lead: string;
  body: string;
  features: { title: string; text: string }[];
  /** An optional list shown as chips on its page (who it is for, what it covers). */
  audience?: { title: string; items: string[] };
  /** Which live interface to show; products without one show their stage only. */
  device?: "paryup" | "oposalud";
  /** Brand colours, shown as light glowing behind the device on a dark stage. */
  glow: [string, string, string?];
  hint?: string;
};

export const products: Product[] = [
  {
    slug: "paryup",
    name: "ParyUp",
    kind: "App",
    category: "Ocio nocturno",
    year: "2026",
    platforms: "iOS y Android",
    status: "Disponible",
    url: "https://paryup.com/",
    summary: "Decide tu noche antes de salir: qué hay hoy, quién va y tu entrada en el móvil.",
    lead: "Crea toda tu noche sin dar vueltas.",
    body: "ParyUp conecta lo que pasa en la ciudad con quienes quieren vivirlo ahora. Descubres planes, ves quién va y entras sin fricción. Y para los clubs, Nexus reúne eventos, acceso, equipo, estadísticas y álbumes en un solo lugar.",
    features: [
      { title: "Qué hay hoy", text: "Todo lo que pasa cerca de ti en un solo sitio, para decidir en segundos." },
      { title: "Sabes quién va", text: "Grupos, mensajes directos y chats de discoteca para organizarte sin salir de la app." },
      { title: "Entrada con QR", text: "Compras tu entrada y accedes con QR, sin saltar entre plataformas." },
      { title: "Eventos privados", text: "Creas tu evento, invitas a quien quieras y controlas quién entra." },
      { title: "Recap de la noche", text: "Cada salida deja un resumen con fotos, gente y momentos para volver a ella." },
      { title: "Nexus para clubs", text: "Eventos, acceso, equipo, estadísticas y álbumes del club, conectados." },
    ],
    audience: { title: "Para", items: ["Quien sale de noche", "Grupos de amigos", "Clubs y salas", "Eventos privados"] },
    device: "paryup",
    glow: ["#ffc23a", "#e86aae", "#7e4fd0"],
    hint: "Desliza los carteles o toca uno cerca de ti.",
  },
  {
    slug: "oposalud",
    name: "Oposalud",
    kind: "App",
    category: "Educación",
    year: "2026",
    platforms: "Android · iOS próximamente",
    status: "Acceso anticipado",
    url: "https://oposalud.app/",
    summary: "La oposición sanitaria, pregunta a pregunta.",
    lead: "Cada especialidad, un paso más cerca de tu plaza.",
    body: "Una app para preparar las oposiciones sanitarias con un tutor de IA disponible a cualquier hora, simulacros por comunidad y un banco de preguntas que se mantiene al día.",
    features: [
      { title: "Tutor IA 24/7", text: "Te explica cada pregunta y cada tema cuando lo necesitas, a cualquier hora." },
      { title: "Simulacros por comunidad", text: "Exámenes con el formato del servicio de salud al que te presentas." },
      { title: "Banco actualizado", text: "Preguntas revisadas y al día con la legislación y los temarios." },
    ],
    audience: { title: "Especialidades", items: ["TCAE", "TES", "Técnico/a de Farmacia", "Celador/a", "Enfermería"] },
    device: "oposalud",
    glow: ["#0f8f6e", "#2fd3a0"],
    hint: "Haz el test: tres preguntas reales de legislación sanitaria.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** "https://paryup.com/" → "paryup.com" */
export const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");
