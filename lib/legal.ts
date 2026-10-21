import { contactEmail } from "./content";

/**
 * The company's identification, as Spanish law (LSSI, art. 10) requires it on
 * the site. Fill in the empty fields: until all of them are set, the legal
 * pages show what is missing, stay out of search engines and out of the sitemap.
 */
export const legal = {
  /** Razón social completa, con la forma jurídica. */
  owner: "Levult S.L.",
  /** NIF / CIF. */
  taxId: "B26825497",
  /** Domicilio social completo: calle, número, código postal, ciudad y país. */
  address: "C. Camps Blancs, 27, 1.º 2.ª, 08830 Sant Boi de Llobregat, Barcelona, España",
  /** Opcional. Ejemplo: "Inscrita en el Registro Mercantil de Madrid, tomo 1, folio 2, hoja M-3". */
  registry: "",
  email: contactEmail,
};

export const legalComplete = Boolean(legal.owner && legal.taxId && legal.address);

/** A legal field, or a visible marker while it is still missing. */
export const filled = (value: string, label: string, pending = "pendiente") => value || `[${label}: ${pending}]`;
