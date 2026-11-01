"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, BookOpen, Bookmark, Menu, Search, Sparkles, X, ShoppingBag, UserRound } from "lucide-react";

// EDIT CHAPTER DETAILS HERE. Add an entry to chapterOverrides to customize
// a chapter title, its aesthetic note, or its destination link.
const chapterOverrides: Record<number, { title?: string; note?: string; href?: string }> = {
  // Example: 1: { title: "The First Note", note: "Where every silence begins to bloom.", href: "https://your-link-here.com" },
};

const seasonRanges = [
  { label: "SEASON 1", start: 1, end: 12, ending: "" },
  { label: "SEASON 2", start: 13, end: 34, ending: "" },
  { label: "SEASON 3", start: 35, end: 67, ending: "END OF SEASON 3" },
  { label: "SEASON 4", start: 68, end: 123, ending: "END OF SEASON 4" },
  { label: "SEASON 5", start: 124, end: 210, ending: "END OF SEASON 5" },
  { label: "AFTER SEASON 5", start: 211, end: 213, ending: "" },
];

const chapters = Array.from({ length: 213 }, (_, index) => {
  const no = index + 1;
  const season = seasonRanges.find((range) => no >= range.start && no <= range.end)!;
  const custom = chapterOverrides[no] || {};
  return {
    no,
    title: custom.title || `Chapter ${String(no).padStart(3, "0")}`,
    note: custom.note || "A quiet page in a story written between music, memory, and the things left unsaid.",
    href: custom.href || "https://t.me/nomoreeurydicesubindo",
    season: season.label,
    ending: season.ending && no === season.end ? season.ending : "",
  };
});

const characters = [
  {
    name: "Kim Hee-jae (김희재)",
    role: "Professor / World-Famous Pianist",
    background: "Heejae is an instructor at a prestigious arts university at the center of Korea's classical music scene. He serves as Han Garam's academic advisor, driving the intense, morally gray, and psychologically complex core of the story.",
    image: "/heejae-character.jpeg",
    alt: "Kim Hee-jae",
  },
  {
    name: "Han Garam (한가람)",
    role: "Piano Major / University Student",
    background: "Garam enrolls in the prestigious music university with a deep passion for the piano. His dedication and talent catch the attention of Professor Heejae, leading him into an entangled and consuming dynamic where his passion becomes deeply tested.",
    image: "/garam-character.jpeg",
    alt: "Han Garam",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = useMemo(() => chapters.filter(c =>
    `${c.no} ${c.title} ${c.season}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#100d10] text-[#eee5d8]">
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <a href="#home" className="brand" onClick={closeMenu}><span className="brand-mark">N<span>✦</span>E</span><span className="brand-sub">A GOTHIC ROMANCE ARCHIVE</span></a>
        <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#story" onClick={closeMenu}>THE STORY</a><a href="#characters" onClick={closeMenu}>CHARACTERS</a><a href="#chapters" onClick={closeMenu}>CHAPTERS</a>
          <span className="nav-divider" aria-hidden="true" />
          <a href="/aboutowner" className="nav-route" onClick={closeMenu}>ABOUT OWNER</a>
          <a href="/pricing" className="nav-cta" onClick={closeMenu}>PRICING <ArrowRight size={14}/></a>
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
            <div className="eyebrow"><span /> A TALE OF LOVE, LOSS & REDEMPTION <span /></div>
            <h1>No More<br/><em>Eurydice</em></h1>
            <p className="hero-desc">Some love stories are written in the stars.<br/>Others are written in the spaces between goodbye.</p>
            <div className="hero-actions">
              <a className="button-primary" href="#story"><BookOpen size={16}/> DISCOVER THE STORY</a>
              <a className="hero-route-button" href="/pricing"><ShoppingBag size={16}/> ORDER NOW</a>
              <a className="hero-route-button" href="/aboutowner"><UserRound size={16}/> ABOUT OWNER</a>
              <button className={`save-button ${saved ? "is-saved" : ""}`} onClick={() => setSaved(!saved)}><Bookmark size={16} fill={saved ? "currentColor" : "none"}/>{saved ? "SAVED TO YOUR LIST" : "SAVE THIS TITLE"}</button>
            </div>
          </motion.div>
        </div>
        <div className="hero-bottom"><span>UNOFFICIAL FAN-MADE ARCHIVE</span><span>VOL. 01 — THE BEGINNING</span><a href="#story">SCROLL TO EXPLORE <ArrowDown size={13}/></a></div>
        <div className="hero-index">01 <span>/</span> 04</div>
      </section>

      <section id="story" className="story-section section-pad">
        <div className="section-kicker">01 — THE STORY</div>
        <div className="story-grid">
          <div>
            <p className="overline">A LOVE THAT DEFIES THE END</p>
            <h2>Even in the<br/><em>darkest chapter,</em><br/>love leaves a trace.</h2>
          </div>
          <div className="story-copy">
            <p className="dropcap">In a world where noble houses guard their secrets as fiercely as their names, two souls find themselves bound by a promise neither remembers making.</p>
            <p>Between quiet corridors, winter gardens, and words left unspoken, a fragile connection begins to bloom. But every fairytale has its shadows — and not every ghost belongs to the past.</p>
            <a href="#chapters" className="text-link">FIND YOUR FIRST CHAPTER <ArrowRight size={15}/></a>
          </div>
        </div>
        <div className="quote-band"><span className="quote-mark">“</span><p>Perhaps the cruelest thing about fate<br/>is how beautifully it can be rewritten.</p><span className="quote-credit">— FROM THE ARCHIVE</span></div>
      </section>

      <section id="characters" className="character-section section-pad">
        <div className="section-heading"><div><div className="section-kicker">02 — THE CAST</div><h2>Main <em>Characters.</em></h2></div><p>Two lives, one piano —<br/>and a melody that lingers.</p></div>
        <div className="character-grid main-character-grid">
          {characters.map((c, i) => <motion.article key={c.name} className="character-card main-character-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .12 }}>
            <div className="character-photo"><img src={c.image} alt={c.alt} loading="lazy"/><span className="character-photo-number">0{i + 1}</span></div>
            <div className="character-info"><div><h3>{c.name}</h3><p className="character-role">{c.role}</p><p className="character-background">{c.background}</p></div></div>
          </motion.article>)}
        </div>
      </section>

      <section id="chapters" className="chapter-section section-pad">
        <div className="section-kicker">03 — THE READING ROOM</div>
        <div className="chapter-head"><div><h2>Turn the <em>page.</em></h2><p className="muted">A little archive of moments worth keeping.</p></div><div className="search-wrap"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search chapters..." aria-label="Search chapters"/></div></div>
        <div className="chapter-list">
          {filtered.map(c => <article key={c.no} className="chapter-row chapter-entry">
            <span className="chapter-no">{String(c.no).padStart(3, "0")}</span>
            <div className="chapter-title"><span>{c.title}</span><small>{c.season}</small><p className="chapter-aesthetic">{c.note}</p></div>
            <div className="chapter-actions"><a className="read-now-button" href={c.href} target="_blank" rel="noreferrer">READ NOW <ArrowRight size={14}/></a></div>
            {c.ending && <div className="season-ending">✦ {c.ending} ✦</div>}
          </article>)}
          {filtered.length === 0 && <p className="empty-state">No chapters found. Try another keyword.</p>}
        </div>
        <p className="chapter-note"><Sparkles size={14}/> 213 chapters are listed by season. Edit <code>chapterOverrides</code> in <code>app/page.tsx</code> to add your own chapter titles, aesthetic notes, or individual links. Every READ NOW button currently opens the Indonesian Telegram channel.</p>
      </section>

      <section id="about" className="about-section">
        <div className="about-ornament">✦</div><div className="section-kicker">04 — THE ARCHIVE</div>
        <h2>For the stories<br/>that <em>stay with us.</em></h2>
        <p>A fan-made corner dedicated to the atmosphere, themes, and characters of <i>No More Eurydice</i>. Made with affection, not affiliated with the original creator or publisher.</p>
        <a href="#home" className="button-outline">BACK TO THE BEGINNING <ArrowDown className="up-arrow" size={14}/></a>
      </section>

      <footer className="footer"><a href="#home" className="footer-brand">N<span>✦</span>E</a><span>UNOFFICIAL FAN-MADE WEBSITE</span><span>© {new Date().getFullYear()} — MADE WITH ♥ FOR THE STORY</span></footer>
    </main>
  );
}

