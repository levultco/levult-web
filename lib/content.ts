export const nav = [
  { label: "ParyUp", href: "#paryup" },
  { label: "Oposalud", href: "#oposalud" },
  { label: "Compañía", href: "#compania" },
  { label: "Contacto", href: "#contacto" },
];

export const contactEmail = "hola@levult.com";

export type Question = {
  q: string;
  options: string[];
  answer: number;
  why: string;
  topic: string;
};

export const oposaludQuestions: Question[] = [
  {
    topic: "Legislación · Tema 4",
    q: "¿Qué ley aprueba el Estatuto Marco del personal estatutario de los servicios de salud?",
    options: ["Ley 14/1986", "Ley 55/2003", "Ley 41/2002", "Ley 16/2003"],
    answer: 1,
    why: "La Ley 55/2003, de 16 de diciembre, aprueba el Estatuto Marco del personal estatutario.",
  },
  {
    topic: "Legislación · Tema 2",
    q: "La Ley 41/2002 regula, sobre todo…",
    options: [
      "La autonomía del paciente y la documentación clínica",
      "La cohesión y calidad del Sistema Nacional de Salud",
      "La prevención de riesgos laborales",
      "Las profesiones sanitarias",
    ],
    answer: 0,
    why: "Es la ley básica reguladora de la autonomía del paciente y de derechos y obligaciones en información y documentación clínica.",
  },
  {
    topic: "Legislación · Tema 1",
    q: "¿Cuál de estas es la Ley General de Sanidad?",
    options: ["Ley 44/2003", "Ley 33/2011", "Ley 14/1986", "Ley 55/2003"],
    answer: 2,
    why: "La Ley 14/1986, de 25 de abril, General de Sanidad, crea el Sistema Nacional de Salud.",
  },
];

import type { PosterKind } from "@/components/mockups/paryup/Poster";

// Sample events for the ParyUp interface (invented venues).
export const paryupEvents: { poster: PosterKind; title: string; venue: string; time: string }[] = [
  { poster: "vinilo", title: "VINILO 90'", venue: "Sala Neón", time: "00:15" },
  { poster: "indigo", title: "TERRAZA CLUB", venue: "Azotea Malasaña", time: "19:00" },
  { poster: "roja", title: "SALA ROJA", venue: "Lavapiés Live", time: "22:00" },
  { poster: "jazz", title: "JAZZ & VERMUT", venue: "Café Olmo", time: "13:30" },
  { poster: "neon", title: "B-SIDE", venue: "Nave 8", time: "23:45" },
];

export const paryupNearby: { poster: PosterKind; distance: string }[] = [
  { poster: "indigo", distance: "1.2KM" },
  { poster: "roja", distance: "2.8KM" },
  { poster: "jazz", distance: "0.6KM" },
  { poster: "neon", distance: "3.4KM" },
];
