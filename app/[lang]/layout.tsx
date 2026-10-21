import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { BootScript } from "@/components/providers/BootScript";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";
import { InkTransition } from "@/components/layout/InkTransition";
import { hasLang, locales, ogLocale, localePath } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/server";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";
import "../globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLang(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: meta.title, template: "%s — Levult" },
    description: meta.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      url: localePath(lang, "/"),
      siteName: site.name,
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export const viewport: Viewport = {
  themeColor: site.colors.ground,
  colorScheme: "light",
};

// Runs before first paint. Marks the document so reveal styles only apply when
// scripts run, and decides whether the intro plays (first visit this session,
// motion allowed). If the app never boots, both are undone so content shows.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('levult-intro-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro')}catch(e){}setTimeout(function(){if(!window.__levultReady){d.classList.remove('js');d.classList.remove('intro')}},3500)})();`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${geist.variable} antialiased`}
    >
      <body>
        <BootScript code={bootScript} />
        <SmoothScroll>
          <InkTransition />
          <Header lang={lang} t={{ header: t.header, menu: t.menu, nav: t.nav, footer: t.footer }} products={getProducts(lang)} />
          <ScrollIndicator />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
