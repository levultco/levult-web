import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DropsScene } from "@/components/webgl/DropsScene";
import { Choreography } from "@/components/providers/Choreography";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { ParyUp, Oposalud } from "@/components/sections/Apps";
import { Company } from "@/components/sections/Company";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <DropsScene />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Statement />
        <ParyUp />
        <Oposalud />
        <Company />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <Choreography />
    </>
  );
}
