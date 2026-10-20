import { DropsScene } from "@/components/webgl/DropsScene";
import { Choreography } from "@/components/providers/Choreography";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Products } from "@/components/sections/Products";
import { Company } from "@/components/sections/Company";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <DropsScene />
      <main className="relative z-10">
        <Hero />
        <Statement />
        {/* One black panel, inset with rounded corners, holds the work and the company. */}
        <div data-drops-mask className="theme-dark relative z-10 rounded-[clamp(24px,3vw,44px)]">
          <Products />
          <Company />
        </div>
        <Contact />
      </main>
      <Choreography />
    </>
  );
}
