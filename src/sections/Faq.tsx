import { Plus } from "@phosphor-icons/react";
import Container from "../components/Container.tsx";
import Reveal from "../components/Reveal.tsx";

const ITEMS = [
  {
    q: "How is the price worked out?",
    a: "A base fare, plus distance, plus the items you add. You see the full total in dalasi before you confirm.",
  },
  { q: "How do I pay?", a: "By card or mobile money, in the app." },
  {
    q: "What if something is damaged?",
    a: "The crew must record any damage with a photo and a note, and every item is checked again before you sign off. You always have a clear record.",
  },
  {
    q: "Do I need an email or password?",
    a: "No. Your phone number and an SMS code get you in, and a PIN keeps your account yours.",
  },
  {
    q: "Who will move my things?",
    a: "Drivers are approved by our team before they take jobs, and the right crew and truck are assigned to your move.",
  },
  {
    q: "Can you move my office?",
    a: "Yes. Add each room or area to your inventory, just like a home move, and get the fare upfront.",
  },
];

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 md:py-28 lg:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <h2 id="faq-title" className="max-w-[14ch] font-display text-display-l text-ink">
              Questions before you book
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-8">
            <div className="divide-y divide-line border-y border-line">
              {ITEMS.map((item, i) => (
                <details key={item.q} open={i === 0} className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-[8px] py-4 font-display text-[17px] font-semibold text-ink select-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-alt text-ink-2 transition-transform duration-200 ease-out group-open:rotate-45 motion-reduce:transition-none"
                    >
                      <Plus size={16} />
                    </span>
                  </summary>
                  <p className="max-w-[60ch] pb-5 pr-12 text-ink-2">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
