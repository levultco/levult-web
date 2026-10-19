import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Levult — La compañía detrás de ParyUp y Oposalud",
  description:
    "Levult crea y opera apps para la vida real: ParyUp, para quedar con gente nueva, y Oposalud, para preparar oposiciones sanitarias.",
};

export const viewport: Viewport = {
  themeColor: "#ecebe7",
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
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
