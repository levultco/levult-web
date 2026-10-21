import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";

// One known address per language, so the page can be prerendered; any other
// address is rendered on request.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang, rest: ["not-found"] }));
}

// Any address that matches no page: shows the site's own 404 inside the language layout.
export default function CatchAll() {
  notFound();
}
