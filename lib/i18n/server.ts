import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLang, type Lang } from "./index";
import { es, type Dict } from "./dictionaries/es";
import { en } from "./dictionaries/en";

const dictionaries: Record<Lang, Dict> = { es, en };

/** The language of the current route (Server Components only). */
export async function getLang(): Promise<Lang> {
  const value = await lang();
  if (!hasLang(value)) notFound();
  return value;
}

export const getDictionary = (language: Lang): Dict => dictionaries[language];

/** The current route's language and its dictionary. */
export async function getI18n() {
  const language = await getLang();
  return { lang: language, t: dictionaries[language] };
}
