import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  themeColor: "#f0f0f2",
};

// Marks the document before first paint so reveal styles only apply when
// scripts run; falls back to visible content if the app never boots.
const bootScript = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__levultReady)document.documentElement.classList.remove('js')},3500);`;

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
          <Header />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
