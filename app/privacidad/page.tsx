import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { filled, legal, legalComplete } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos trata levult.com, para qué, durante cuánto tiempo y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
  robots: { index: legalComplete, follow: true },
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Privacidad y cookies" lead="Qué datos tratamos, para qué y cómo ejercer tus derechos. Esta web no usa cookies ni analítica.">
      <LegalSection title="Responsable del tratamiento">
        <ul>
          <li>
            <strong>Responsable:</strong> {filled(legal.owner, "Razón social")}
          </li>
          <li>
            <strong>NIF:</strong> {filled(legal.taxId, "NIF")}
          </li>
          <li>
            <strong>Domicilio:</strong> {filled(legal.address, "Domicilio social")}
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
