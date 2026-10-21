/**
 * The site's text in Spanish, the source language. English (en.ts) must have
 * exactly the same shape: the type is taken from this file.
 */
export const es = {
  meta: {
    title: "Levult — Creamos lo que viene",
    tagline: "Creamos lo que viene.",
    description:
      "Levult es una empresa tecnológica que diseña, desarrolla y hace crecer sus propios productos digitales, como ParyUp y Oposalud. De la primera idea al mundo real.",
    ogAlt: "Levult — Creamos lo que viene",
    ogLines: ["Creamos lo", "que viene."],
    ogSub: "Productos digitales propios, de la primera idea al mundo real.",
    productOgAlt: "Un trabajo destacado de Levult",
    notFoundTitle: "Página no encontrada",
    breadcrumbHome: "Inicio",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Destacados", href: "/#destacados" },
    { label: "Compañía", href: "/#compania" },
    { label: "Contacto", href: "/#contacto" },
  ],
  header: {
    homeAria: "Levult, inicio",
    talk: "Hablemos",
    menu: "Menú",
    close: "Cerrar",
    /** Short name of the other language, and what the button does. */
    switchShort: "EN",
    switchAria: "Ver esta página en inglés",
  },
  menu: {
    aria: "Menú",
    mainAria: "Menú principal",
    featured: "Trabajos destacados",
  },
  hero: {
    title: "Creamos lo que viene.",
    text: "Levult es una empresa tecnológica que diseña, desarrolla y hace crecer sus propios productos digitales. De la primera idea al mundo real.",
    seeWork: "Ver trabajos",
    company: "La compañía",
  },
  statement: {
    title: "Cómo trabajamos",
    text: "El mundo no necesita más apps. Necesita mejores. Construimos productos que merecen existir y nos quedamos para hacerlos crecer.",
  },
  products: {
    title: "Trabajos destacados",
    text: "Apps y webs que diseñamos, programamos y operamos nosotros mismos, de la primera idea al día a día.",
    viewWork: "Ver trabajo",
  },
  company: {
    title: "Construimos para quedarnos.",
    text: "Levult diseña, desarrolla y opera sus propios productos digitales. Lanzamos menos, pero cuidamos cada uno durante años.",
    principles: [
      { title: "Producto propio", text: "Todo lo que lanzamos es nuestro, y lo mantenemos vivo." },
      { title: "Lo usamos nosotros", text: "Si no lo abriríamos cada día, no sale a la calle." },
      { title: "Medimos en personas", text: "Gente que vuelve, planes que se cumplen, plazas que se aprueban. Lo demás es ruido." },
    ],
  },
  contact: {
    title: "¿Hablamos?",
    text: "Escríbenos si quieres hablar de alguno de nuestros productos, colaborar con nosotros o unirte al equipo.",
    press: "Prensa",
    collaborate: "Colaborar",
    work: "Trabajar aquí",
    subjectPress: "Prensa · Levult",
    subjectCollaborate: "Colaboración · Levult",
    subjectWork: "Trabajar en Levult",
  },
  footer: {
    navigation: "Navegación",
    featured: "Destacados",
    tagline: "Levult crea, lanza y hace crecer productos digitales propios.",
    legal: "Aviso legal",
    privacy: "Privacidad",
  },
  legalPage: {
    updated: "Última actualización",
    updatedDate: "21 de octubre de 2026",
    index: "En esta página",
    pending: "pendiente",
    notice: { title: "Aviso legal", lead: "Quién es el titular de esta web y bajo qué condiciones puedes usarla." },
    privacy: {
      title: "Privacidad y cookies",
      lead: "Qué datos tratamos, para qué y cómo ejercer tus derechos. Esta web no usa cookies ni analítica.",
    },
  },
  product: {
    back: "Trabajos destacados",
    facts: { kind: "Tipo", category: "Categoría", platforms: "Plataformas", status: "Estado" },
    visit: "Visitar {domain}",
    running: "{name} en funcionamiento",
    whatItDoes: "Qué hace",
    webOf: "La web de {name}",
    visitWeb: "Visitar web",
    next: "Siguiente trabajo",
    nextAria: "Siguiente trabajo: {name}",
    viewWork: "Ver trabajo",
    titleSuffix: "Levult",
    description: "{summary} {kind} de {category} creada por Levult.",
  },
  notFound: {
    code: "Error 404",
    title: "Esta página se nos ha escapado.",
    text: "El enlace puede estar roto o la página haberse movido. Vuelve al inicio o entra directo a uno de nuestros trabajos.",
    home: "Volver al inicio",
  },
};

export type Dict = typeof es;
