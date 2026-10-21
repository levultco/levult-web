import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { filled, legal, legalComplete } from "@/lib/legal";
import { productFacts } from "@/lib/products";
import { site } from "@/lib/site";
import { hasLang } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/aviso-legal">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLang(lang)) return {};
  return {
    title: lang === "en" ? "Legal notice" : "Aviso legal",
    description:
      lang === "en"
        ? "Who owns levult.com and the terms of use of the website."
        : "Datos del titular de levult.com y condiciones de uso de la web.",
    alternates: alternatesFor(lang, "/aviso-legal"),
    robots: { index: legalComplete, follow: true },
  };
}

export default async function AvisoLegalPage() {
  const { lang, t } = await getI18n();
  const domain = site.url.replace(/^https?:\/\//, "");
  const names = productFacts.map((p) => p.name);
  const hosts = productFacts.map((p) => new URL(p.url).hostname);
  const pending = t.legalPage.pending;

  if (lang === "en") {
    return (
      <LegalPage title={t.legalPage.notice.title} lead={t.legalPage.notice.lead}>
        <LegalSection title="Website owner">
          <p>
            In compliance with article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), you are informed that
            this website, <strong>{domain}</strong>, is owned by:
          </p>
          <ul>
            <li>
              <strong>Owner:</strong> {filled(legal.owner, "Company name", pending)}
            </li>
            <li>
              <strong>Tax ID (NIF):</strong> {filled(legal.taxId, "Tax ID", pending)}
            </li>
            <li>
              <strong>Registered office:</strong> {filled(legal.address, "Registered office", pending)}
            </li>
            <li>
              <strong>Email:</strong> <a href={`mailto:${legal.email}`}>{legal.email}</a>
            </li>
            {legal.registry && (
              <li>
                <strong>Commercial Registry:</strong> {legal.registry}
              </li>
            )}
          </ul>
        </LegalSection>

        <LegalSection title="Purpose">
          <p>
            This website presents Levult and the digital products it develops and operates, such as {names.join(" and ")}. Access is free of charge and
            requires no registration.
          </p>
        </LegalSection>

        <LegalSection title="Terms of use">
          <p>
            By accessing and using the website you accept this notice. You agree to use it in good faith and in accordance with the law, without harming,
            overloading or preventing its normal operation, and without trying to access areas or data that are not public.
          </p>
          <p>We may change the website&apos;s content, or this notice, at any time. The date of the last update appears above.</p>
        </LegalSection>

        <LegalSection title="Intellectual and industrial property">
          <p>
            The texts, design, code, logo, animations and all other content of the website belong to {filled(legal.owner, "Owner", pending)} or to third
            parties who have authorised their use, and are protected by intellectual and industrial property law. Product names and trademarks belong to
            their respective owners.
          </p>
          <p>
            Reproducing, distributing, publicly communicating or transforming this content is not permitted without prior written authorisation, except
            for the uses the law expressly allows. If you believe any content infringes your rights, write to{" "}
            <a href={`mailto:${legal.email}`}>{legal.email}</a> and we will review it.
          </p>
        </LegalSection>

        <LegalSection title="Links to other websites">
          <p>
            The website links to the products&apos; sites ({hosts.join(", ")}). Those sites are governed by their own legal notices and policies. We do not
            control the content of third-party websites and are not responsible for it.
          </p>
        </LegalSection>

        <LegalSection title="Liability">
          <p>
            We do our best to keep the information correct and up to date, but we do not guarantee that it is error-free or that the website is always
            available. We are not liable for damages arising from interruptions, technical failures or the use made of the information published, except
            where the law prevents it.
          </p>
        </LegalSection>

        <LegalSection title="Governing law and jurisdiction">
          <p>
            This notice is governed by Spanish law. For any dispute, the parties will submit to the courts that have jurisdiction under applicable
            legislation; if you are a consumer, to those of your place of residence where the law so provides.
          </p>
        </LegalSection>
      </LegalPage>
    );
  }

  return (
    <LegalPage title={t.legalPage.notice.title} lead={t.legalPage.notice.lead}>
      <LegalSection title="Titular del sitio web">
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se
          informa de que este sitio web, <strong>{domain}</strong>, es titularidad de:
        </p>
        <ul>
          <li>
            <strong>Titular:</strong> {filled(legal.owner, "Razón social", pending)}
          </li>
          <li>
            <strong>NIF:</strong> {filled(legal.taxId, "NIF", pending)}
          </li>
          <li>
            <strong>Domicilio:</strong> {filled(legal.address, "Domicilio social", pending)}
          </li>
          <li>
            <strong>Correo electrónico:</strong> <a href={`mailto:${legal.email}`}>{legal.email}</a>
          </li>
          {legal.registry && (
            <li>
              <strong>Registro Mercantil:</strong> {legal.registry}
            </li>
          )}
        </ul>
      </LegalSection>

      <LegalSection title="Objeto">
        <p>
          Esta web presenta a Levult y los productos digitales que desarrolla y opera, como {names.join(" y ")}. Su acceso es
          gratuito y no exige registro.
        </p>
      </LegalSection>

      <LegalSection title="Condiciones de uso">
        <p>
          Acceder a la web y usarla implica aceptar este aviso. Te comprometes a hacerlo de buena fe y conforme a la ley, sin dañar, sobrecargar ni
          impedir su funcionamiento normal, y sin intentar acceder a zonas o datos que no sean públicos.
        </p>
        <p>Podemos modificar el contenido de la web, o este aviso, en cualquier momento. La fecha de la última actualización figura arriba.</p>
      </LegalSection>

      <LegalSection title="Propiedad intelectual e industrial">
        <p>
          Los textos, el diseño, el código, el logotipo, las animaciones y el resto de contenidos de la web son de {filled(legal.owner, "Titular", pending)} o de
          terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial. Los nombres y marcas de los
          productos pertenecen a sus respectivos titulares.
        </p>
        <p>
          No se permite reproducir, distribuir, comunicar públicamente ni transformar estos contenidos sin autorización previa y por escrito, salvo para
          los usos que la ley permite expresamente. Si crees que algún contenido vulnera tus derechos, escríbenos a{" "}
          <a href={`mailto:${legal.email}`}>{legal.email}</a> y lo revisaremos.
        </p>
      </LegalSection>

      <LegalSection title="Enlaces a otras webs">
        <p>
          La web enlaza a los sitios de los productos ({hosts.join(", ")}). Esos sitios se rigen por sus propios
          avisos legales y políticas. No controlamos los contenidos de webs de terceros y no respondemos de ellos.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilidad">
        <p>
          Hacemos lo posible por que la información sea correcta y esté actualizada, pero no garantizamos que esté libre de errores ni que la web esté
          siempre disponible. No respondemos de los daños que pudieran derivarse de interrupciones, fallos técnicos o del uso que se haga de la
          información publicada, salvo en los casos en que la ley lo impida.
        </p>
      </LegalSection>

      <LegalSection title="Legislación aplicable y jurisdicción">
        <p>
          Este aviso se rige por la legislación española. Para cualquier controversia, las partes se someterán a los juzgados y tribunales que
          correspondan conforme a la normativa vigente; si eres consumidor, a los de tu domicilio cuando así lo establezca la ley.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
