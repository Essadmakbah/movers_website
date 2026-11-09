import Nav from "./sections/Nav.tsx";
import Hero from "./sections/Hero.tsx";
import Journey from "./sections/Journey.tsx";
import Features from "./sections/Features.tsx";
import Apps from "./sections/Apps.tsx";
import Local from "./sections/Local.tsx";
import Drive from "./sections/Drive.tsx";
import Faq from "./sections/Faq.tsx";
import Cta from "./sections/Cta.tsx";
import Footer from "./sections/Footer.tsx";

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Journey />
        <Features />
        <Apps />
        <Local />
        <Drive />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
