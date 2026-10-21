import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { filled, legal, legalComplete } from "@/lib/legal";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Datos del titular de levult.com y condiciones de uso de la web.",
  alternates: { canonical: "/aviso-legal" },
  robots: { index: legalComplete, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal" lead="Quién es el titular de esta web y bajo qué condiciones puedes usarla.">
      <LegalSection title="Titular del sitio web">
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se
          informa de que este sitio web, <strong>{site.url.replace(/^https?:\/\//, "")}</strong>, es titularidad de:
        </p>
        <ul>
          <li>
            <strong>Titular:</strong> {filled(legal.owner, "Razón social")}
          </li>
          <li>
            <strong>NIF:</strong> {filled(legal.taxId, "NIF")}
          </li>
          <li>
            <strong>Domicilio:</strong> {filled(legal.address, "Domicilio social")}
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
          Esta web presenta a Levult y los productos digitales que desarrolla y opera, como {products.map((p) => p.name).join(" y ")}. Su acceso es
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
          Los textos, el diseño, el código, el logotipo, las animaciones y el resto de contenidos de la web son de {filled(legal.owner, "Titular")} o de
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
          La web enlaza a los sitios de los productos ({products.map((p) => new URL(p.url).hostname).join(", ")}). Esos sitios se rigen por sus propios
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
