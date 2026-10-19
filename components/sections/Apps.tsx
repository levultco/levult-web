import { AppSection } from "./AppSection";
import { ParyUpScreen } from "@/components/mockups/ParyUpScreen";
import { OposaludQuiz } from "@/components/mockups/OposaludQuiz";

export function ParyUp() {
  return (
    <AppSection
      id="paryup"
      name="ParyUp"
      color="var(--paryup)"
      side="left"
      lead="Lo que pasa esta noche en tu ciudad, y con quién ir."
      body="Fiestas, conciertos y planes de tu zona en un solo sitio. Ves el cartel, la hora y la distancia, te apuntas y hablas con la gente que va antes de llegar."
      device={<ParyUpScreen />}
      deviceNote="Desliza los carteles o toca uno cerca de ti."
      features={[
        { title: "Agenda del día", text: "Los eventos de cada noche, con su cartel, el local y la hora." },
        { title: "Cerca de ti", text: "Lo que tienes a pocos minutos, ordenado por distancia, y en el mapa." },
        { title: "Chats", text: "Habla con quien va al mismo plan antes de llegar." },
      ]}
      facts={[
        { term: "Categoría", detail: "Social" },
        { term: "Plataformas", detail: "iOS y Android" },
        { term: "Desde", detail: "2026" },
      ]}
    />
  );
}

export function Oposalud() {
  return (
    <AppSection
      id="oposalud"
      name="Oposalud"
      color="var(--oposalud)"
      side="right"
      lead="La oposición sanitaria, pregunta a pregunta."
      body="Para opositores a enfermería, TCAE, celador y técnico sanitario. Estudias en ratos cortos y la app decide qué repasar según tus fallos."
      device={<OposaludQuiz />}
      deviceNote="Haz el test: tres preguntas reales de legislación sanitaria."
      features={[
        { title: "Tests por tema", text: "Por categoría profesional y por servicio de salud de cada comunidad." },
        { title: "Simulacros", text: "Con el número de preguntas y el tiempo del examen real." },
        { title: "Repaso de fallos", text: "Lo que fallas vuelve a aparecer hasta que deja de fallarse." },
      ]}
      facts={[
        { term: "Categoría", detail: "Educación" },
        { term: "Plataformas", detail: "iOS, Android y web" },
        { term: "Desde", detail: "2026" },
      ]}
    />
  );
}
