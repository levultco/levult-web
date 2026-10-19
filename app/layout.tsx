import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";
import { InkTransition } from "@/components/layout/InkTransition";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: { default: "Levult — Creamos lo que viene", template: "%s — Levult" },
  description:
    "Levult crea, lanza y hace crecer sus propias apps y webs, como ParyUp y Oposalud.",
};

export const viewport: Viewport = {
  themeColor: "#eaecf0",
};

// Runs before first paint. Marks the document so reveal styles only apply when
// scripts run, and decides whether the intro plays (first visit this session,
// motion allowed). If the app never boots, both are undone so content shows.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('levult-intro-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro')}catch(e){}setTimeout(function(){if(!window.__levultReady){d.classList.remove('js');d.classList.remove('intro')}},3500)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geist.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SmoothScroll>
          <InkTransition />
          <Header />
          <ScrollIndicator />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
