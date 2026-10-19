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
  /** One line for the card. */
  summary: string;
  /** The opening sentence of its page. */
  lead: string;
  body: string;
  features: { title: string; text: string }[];
  /** Which live interface to show; products without one show their stage only. */
  device?: "paryup" | "oposalud";
  /** Brand stage behind the device: a CSS class from globals.css. */
  stage: string;
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
    summary: "Toda tu noche en un sitio: eventos, entradas y gente con la que ir.",
    lead: "Lo que pasa esta noche en tu ciudad, y con quién ir.",
    body: "Fiestas, conciertos y planes de tu zona en un solo sitio. Ves el cartel, la hora y la distancia, te apuntas y hablas con la gente que va antes de llegar.",
    features: [
      { title: "Agenda del día", text: "Los eventos de cada noche, con su cartel, el local y la hora." },
      { title: "Cerca de ti", text: "Lo que tienes a pocos minutos, ordenado por distancia, y en el mapa." },
      { title: "Chats", text: "Habla con quien va al mismo plan antes de llegar." },
    ],
    device: "paryup",
    stage: "stage-paryup",
    hint: "Desliza los carteles o toca uno cerca de ti.",
  },
  {
    slug: "oposalud",
    name: "Oposalud",
    kind: "App",
    category: "Educación",
    year: "2026",
    platforms: "iOS, Android y web",
    summary: "La oposición sanitaria, pregunta a pregunta.",
    lead: "Prepara tu plaza en ratos cortos, con preguntas reales.",
    body: "Para opositores a enfermería, TCAE, celador y técnico sanitario. Estudias en ratos cortos y la app decide qué repasar según tus fallos.",
    features: [
      { title: "Tests por tema", text: "Por categoría profesional y por servicio de salud de cada comunidad." },
      { title: "Simulacros", text: "Con el número de preguntas y el tiempo del examen real." },
      { title: "Repaso de fallos", text: "Lo que fallas vuelve a aparecer hasta que deja de fallarse." },
    ],
    device: "oposalud",
    stage: "stage-oposalud",
    hint: "Haz el test: tres preguntas reales de legislación sanitaria.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
