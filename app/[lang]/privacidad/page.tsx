import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { filled, legal, legalComplete } from "@/lib/legal";

import { hasLang } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidad">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLang(lang)) return {};
  return {
    title: lang === "en" ? "Privacy policy" : "Política de privacidad",
    description:
      lang === "en"
        ? "What data levult.com processes, why, for how long and how to exercise your rights."
        : "Qué datos trata levult.com, para qué, durante cuánto tiempo y cómo ejercer tus derechos.",
    alternates: alternatesFor(lang, "/privacidad"),
    robots: { index: legalComplete, follow: true },
  };
}

export default async function PrivacidadPage() {
  const { lang, t } = await getI18n();
  const pending = t.legalPage.pending;

  if (lang === "en") {
    return (
      <LegalPage title={t.legalPage.privacy.title} lead={t.legalPage.privacy.lead}>
        <LegalSection title="Data controller">
          <ul>
            <li>
              <strong>Controller:</strong> {filled(legal.owner, "Company name", pending)}
            </li>
            <li>
              <strong>Tax ID (NIF):</strong> {filled(legal.taxId, "Tax ID", pending)}
            </li>
            <li>
              <strong>Address:</strong> {filled(legal.address, "Registered office", pending)}
            </li>
            <li>
              <strong>Contact:</strong> <a href={`mailto:${legal.email}`}>{legal.email}</a>
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="What data we process and why">
          <p>
            The website has no forms, user accounts or subscriptions. The only personal data we process is what you send us when you write to us at{" "}
            <a href={`mailto:${legal.email}`}>{legal.email}</a>: your email address, your name if you include it, and the content of your message.
          </p>
          <ul>
            <li>
              <strong>Purpose:</strong> to deal with your enquiry, collaboration proposal, press request or job application, and to reply to you.
            </li>
            <li>
              <strong>Legal basis:</strong> your consent when you write to us and, when you ask for information or a collaboration, the application of
              pre-contractual measures at your request (art. 6.1.a and 6.1.b GDPR).
            </li>
            <li>
              <strong>Retention:</strong> for as long as the conversation lasts and, afterwards, for the time needed to deal with possible liabilities; if
              there is no further relationship, we delete it when it is no longer needed.
            </li>
            <li>
              <strong>Recipients:</strong> we do not share your data with third parties except where legally required. The providers that supply our email
              service and host the website access it only to provide that service, under a data processing agreement.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Technical server data">
          <p>
            As on any website, the server that hosts it may automatically log connection data such as the IP address, date and time, the page requested
            and the browser. It is used only for the operation and security of the service, not to identify you or build profiles, and is kept for the
            minimum time necessary.
          </p>
        </LegalSection>

        <LegalSection title="Cookies and local storage">
          <p>
            This website <strong>does not set cookies</strong>, neither its own nor third-party, and uses no analytics or advertising tools. That is why it
            shows no cookie banner.
          </p>
          <p>
            It does use the browser&apos;s session storage (<em>sessionStorage</em>) for a single technical purpose: to remember, while the tab stays open,
            that you have already seen the intro animation, so it is not repeated on every page. It contains no personal data, never leaves your device and
            is deleted when you close the tab. It is exempt from consent because it is strictly necessary for the service you have requested.
          </p>
        </LegalSection>

        <LegalSection title="Your rights">
          <p>You can exercise the following rights over your data at any time:</p>
          <ul>
            <li>Access, to know what data of yours we hold.</li>
            <li>Rectification, if it is inaccurate.</li>
            <li>Erasure, when it is no longer necessary or you withdraw your consent.</li>
            <li>Objection and restriction of processing.</li>
            <li>Portability, to receive it in a structured format.</li>
            <li>Withdrawal of consent where it is the basis for processing, without affecting what has already been done.</li>
          </ul>
          <p>
            To exercise them, write to <a href={`mailto:${legal.email}`}>{legal.email}</a> stating the right you wish to exercise; we may ask you to prove
            your identity. If you believe we have not handled your data properly, you can lodge a complaint with the{" "}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
              Spanish Data Protection Agency (AEPD)
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="Minors">
          <p>The website is not aimed at children under 14 and we do not knowingly collect their data.</p>
        </LegalSection>

        <LegalSection title="Changes to this policy">
          <p>
            If the way we process data changes, for example if we add a form or an analytics tool, we will update this page and the date above before we
            start.
          </p>
        </LegalSection>
      </LegalPage>
    );
  }

  return (
    <LegalPage title={t.legalPage.privacy.title} lead={t.legalPage.privacy.lead}>
      <LegalSection title="Responsable del tratamiento">
        <ul>
          <li>
            <strong>Responsable:</strong> {filled(legal.owner, "Razón social", pending)}
          </li>
          <li>
            <strong>NIF:</strong> {filled(legal.taxId, "NIF", pending)}
          </li>
          <li>
            <strong>Domicilio:</strong> {filled(legal.address, "Domicilio social", pending)}
          </li>
          <li>
            <strong>Contacto:</strong> <a href={`mailto:${legal.email}`}>{legal.email}</a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Qué datos tratamos y para qué">
        <p>
          La web no tiene formularios, cuentas de usuario ni suscripciones. El único dato personal que tratamos es el que nos envías tú al escribirnos
          por correo a <a href={`mailto:${legal.email}`}>{legal.email}</a>: tu dirección de correo, tu nombre si lo incluyes y el contenido del mensaje.
        </p>
        <ul>
          <li>
            <strong>Finalidad:</strong> atender tu consulta, propuesta de colaboración, solicitud de prensa o candidatura, y responderte.
          </li>
          <li>
            <strong>Base jurídica:</strong> tu consentimiento al escribirnos y, cuando pidas información o una colaboración, la aplicación de medidas
            precontractuales a petición tuya (art. 6.1.a y 6.1.b del RGPD).
          </li>
          <li>
            <strong>Conservación:</strong> mientras dure la conversación y, después, el tiempo necesario para atender posibles responsabilidades; si no
            hay relación posterior, lo borramos cuando deje de ser necesario.
          </li>
          <li>
            <strong>Destinatarios:</strong> no cedemos tus datos a terceros salvo obligación legal. Los proveedores que nos prestan el servicio de correo y
            el alojamiento de la web acceden a ellos solo para prestarnos ese servicio, bajo contrato de encargado del tratamiento.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Datos técnicos del servidor">
        <p>
          Como en cualquier web, el servidor que la aloja puede registrar de forma automática datos de conexión como la dirección IP, la fecha y hora, la
          página solicitada y el navegador. Se usan solo para el funcionamiento y la seguridad del servicio, no para identificarte ni para elaborar
          perfiles, y se conservan el tiempo mínimo necesario.
        </p>
      </LegalSection>

      <LegalSection title="Cookies y almacenamiento local">
        <p>
          Esta web <strong>no instala cookies</strong>, ni propias ni de terceros, y no usa herramientas de analítica ni de publicidad. Por eso no
          muestra un banner de cookies.
        </p>
        <p>
          Sí usa el almacenamiento de sesión del navegador (<em>sessionStorage</em>) para un único fin técnico: recordar, mientras la pestaña siga
          abierta, que ya has visto la animación de entrada, y así no repetirla en cada página. No contiene datos personales, no sale de tu dispositivo
          y se borra al cerrar la pestaña. Está exento de consentimiento por ser estrictamente necesario para el servicio que has pedido.
        </p>
      </LegalSection>

      <LegalSection title="Tus derechos">
        <p>Puedes ejercer en cualquier momento los siguientes derechos sobre tus datos:</p>
        <ul>
          <li>Acceso, para saber qué datos tuyos tenemos.</li>
          <li>Rectificación, si son inexactos.</li>
          <li>Supresión, cuando ya no sean necesarios o retires tu consentimiento.</li>
          <li>Oposición y limitación del tratamiento.</li>
          <li>Portabilidad, para recibirlos en un formato estructurado.</li>
          <li>Retirar el consentimiento cuando sea la base del tratamiento, sin que afecte a lo ya hecho.</li>
        </ul>
        <p>
          Para ejercerlos, escríbenos a <a href={`mailto:${legal.email}`}>{legal.email}</a> indicando el derecho que quieres ejercer; podemos pedirte que
          acredites tu identidad. Si crees que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
            Agencia Española de Protección de Datos
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Menores">
        <p>La web no está dirigida a menores de 14 años y no recogemos datos suyos de forma intencionada.</p>
      </LegalSection>

      <LegalSection title="Cambios en esta política">
        <p>
          Si cambia la forma en que tratamos datos, por ejemplo si añadimos un formulario o una herramienta de analítica, actualizaremos esta página y
          la fecha de arriba antes de empezar.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
