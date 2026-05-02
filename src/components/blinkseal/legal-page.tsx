import Link from "next/link";
import { LogoIcon } from "@/components/blinkseal/logo";

type LegalSection = {
  title: string;
  body?: string[];
  bullets?: string[];
};

export function LegalPage({
  title,
  eyebrow,
  intro,
  sections
}: {
  title: string;
  eyebrow: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.10),transparent_42%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:auto,72px_72px,72px_72px]" />
      <header className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-transparent">
              <LogoIcon size={38} variant="dark" className="rounded-xl opacity-90 mix-blend-screen" />
            </span>
            <span className="text-xl leading-none tracking-wide text-white"><span>Blink</span><span className="font-semibold">Seal</span></span>
          </Link>
          <Link href="/sign-up" className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.20)] transition hover:bg-sky-300">
            Get Started Free
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{intro}</p>

        <div className="mt-10 space-y-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_0_40px_rgba(56,189,248,0.06)] backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-7 text-slate-400">{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
