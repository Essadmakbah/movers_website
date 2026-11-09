import Container from "../components/Container.tsx";
import Logo from "../components/Logo.tsx";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-moviin", label: "Why Moviin" },
  { href: "#apps", label: "The apps" },
  { href: "#drive", label: "Drive with Moviin" },
  { href: "#faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-line py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <a href="#top" aria-label="Moviin, back to top" className="w-fit rounded-xl">
          <Logo size={32} />
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-1 gap-y-0 text-sm text-ink-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex min-h-11 items-center rounded-full px-2.5 transition-colors duration-200 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-ink-3">© 2026 Moviin. Banjul, The Gambia.</p>
      </Container>
    </footer>
  );
}
