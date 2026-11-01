
const links = [
  {
    number: "01",
    title: "Testimonials",
    subtitle: "Andrew & Luke",
    description:
      "Lihat ulasan dan pengalaman pengguna yang telah menggunakan layanan kami.",
    label: "VIEW TESTIMONIALS",
    href: "https://t.me/andrewtesti",
  },
  {
    number: "02",
    title: "WhatsApp Group",
    subtitle: "Andrew & Luke Store",
    description:
      "Bergabung dengan grup WhatsApp store untuk mendapatkan informasi dan berinteraksi dengan kami.",
    label: "JOIN WHATSAPP GROUP",
    href: "https://chat.whatsapp.com/Fvit93nPdVz9mLuAx9E2md?mode=gi_t",
  },
];

export default function AboutOwnerPage() {
  return (
    <main className="min-h-screen bg-[#101b18] text-[#eee8df]">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">

        {/* HEADER */}
        <header className="mb-14 text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#d9aebc]">
            Behind The Project
          </p>

          <div className="mb-7 text-sm tracking-[0.4em] text-[#e8b9c8]">
            ✦ ───────── ✦
          </div>

          <h1 className="font-serif text-5xl leading-tight sm:text-7xl">
            About
            <br />
            <span className="italic text-[#e8b9c8]">
              the Owners
            </span>
          </h1>

          <p className="mt-7 font-serif text-lg italic text-[#d9c8c4]">
            By Andrew And Luke
          </p>
        </header>

        {/* OWNER CARD */}
        <section className="mx-auto mb-12 max-w-3xl border border-[#c99eaa]/60 bg-[#1a2924]/90 px-6 py-12 text-center shadow-xl sm:px-12">

          <div className="mb-6 text-3xl tracking-[0.5em] text-[#e8b9c8]">
            ♩ ♫ ♬
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-[#d9aebc]">
            The People Behind This Service
          </p>

          <h2 className="mt-7 font-serif text-5xl sm:text-7xl">
            Andrew <span className="italic text-[#e8b9c8]">&</span> Luke
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#d0d7d0]">
            Pengelola layanan sewa bot No More Eurydice.
            Kami berusaha memberikan layanan yang nyaman,
            praktis, dan dapat diandalkan untuk kebutuhan
            pengguna.
          </p>

          <div className="mx-auto mt-8 h-px max-w-xs bg-[#c99eaa]/40" />

          <p className="mt-7 text-xs uppercase tracking-[0.25em] text-[#d9aebc]">
            Our Little Corner
          </p>

          <p className="mt-3 font-serif text-xl italic text-[#eee8df]">
            A service made with care.
          </p>
        </section>

        {/* SEPARATE LINK CARDS */}
        <section className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">

          {links.map((item) => (
            <article
              key={item.number}
              className="flex flex-col border border-[#c99eaa]/50 bg-[#1a2924]/90 p-7 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#e8b9c8]"
            >
              <p className="text-xs tracking-[0.3em] text-[#d9aebc]">
                {item.number} / CONNECTION
              </p>

              <h3 className="mt-6 font-serif text-3xl">
                {item.title}
              </h3>

              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#e8b9c8]">
                {item.subtitle}
              </p>

              <p className="mt-5 flex-1 text-sm leading-7 text-[#c9d0ca]">
                {item.description}
              </p>

              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex min-h-12 items-center justify-center border border-[#e8b9c8] bg-[#e8b9c8] px-4 py-3 text-center text-xs font-semibold tracking-[0.12em] text-[#17231f] transition hover:bg-transparent hover:text-[#f0c3d0]"
              >
                {item.label}
              </a>
            </article>
          ))}

        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-[#c99eaa]/30 pt-8 text-center">
          <p className="font-serif text-2xl italic text-[#e8b9c8]">
            No More Eurydice
          </p>

          <p className="mt-3 text-[10px] tracking-[0.3em] text-[#aebbb3]">
            A GOTHIC ROMANCE ARCHIVE
          </p>

          <p className="mt-5 text-xs text-[#9eaaa2]">
            © Andrew & Luke
          </p>
        </footer>

      </div>
    </main>
  );
}
