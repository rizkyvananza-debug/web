"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, BookOpen, Bookmark, ChevronDown, Heart, Menu, Search, Sparkles, X } from "lucide-react";

const chapters = [
  { no: "01", title: "A Song Beneath the Moon", type: "Story", date: "Prologue" },
  { no: "02", title: "The Duke’s Unwanted Bride", type: "Story", date: "Chapter 01" },
  { no: "03", title: "A Promise in Winter", type: "Story", date: "Chapter 02" },
  { no: "04", title: "The Shape of a Secret", type: "Story", date: "Chapter 03" },
  { no: "05", title: "Where the Lilies Sleep", type: "Story", date: "Chapter 04" },
  { no: "06", title: "A Waltz for Two Ghosts", type: "Side Story", date: "Side Story 01" },
];

const characters = [
  { name: "The Duchess", role: "A heart caught between duty and desire", symbol: "✦", tone: "rose" },
  { name: "The Duke", role: "A man with a silence of his own", symbol: "♜", tone: "gold" },
  { name: "The Past", role: "Some stories refuse to stay buried", symbol: "☾", tone: "silver" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  const filtered = useMemo(() => chapters.filter(c =>
    `${c.no} ${c.title} ${c.date}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#100d10] text-[#eee5d8]">
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <a href="#home" className="brand" onClick={closeMenu}><span className="brand-mark">N<span>✦</span>E</span><span className="brand-sub">A GOTHIC ROMANCE ARCHIVE</span></a>
        <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#story" onClick={closeMenu}>THE STORY</a><a href="#characters" onClick={closeMenu}>CHARACTERS</a><a href="#chapters" onClick={closeMenu}>CHAPTERS</a><a href="#about" onClick={closeMenu}>ABOUT</a>
          <a href="#chapters" className="nav-cta" onClick={closeMenu}>EXPLORE <ArrowRight size={14}/></a>
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
        <div className="section-heading"><div><div className="section-kicker">02 — THE CAST</div><h2>Hearts in <em>silhouette.</em></h2></div><p>Every secret has a keeper.<br/>Every heart, a hidden room.</p></div>
        <div className="character-grid">
          {characters.map((c, i) => <motion.article key={c.name} className={`character-card ${c.tone}`} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .12 }}>
            <div className="character-art"><span className="art-orbit"/><span className="art-symbol">{c.symbol}</span><span className="art-number">0{i+1}</span><span className="art-caption">A STUDY IN CONTRAST</span></div>
            <div className="character-info"><div><h3>{c.name}</h3><p>{c.role}</p></div><ArrowUpRightFallback /></div>
          </motion.article>)}
        </div>
      </section>

      <section id="chapters" className="chapter-section section-pad">
        <div className="section-kicker">03 — THE READING ROOM</div>
        <div className="chapter-head"><div><h2>Turn the <em>page.</em></h2><p className="muted">A little archive of moments worth keeping.</p></div><div className="search-wrap"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search chapters..." aria-label="Search chapters"/></div></div>
        <div className="chapter-list">
          {filtered.map(c => <button key={c.no} className={`chapter-row ${activeChapter === c.no ? "active" : ""}`} onClick={() => setActiveChapter(activeChapter === c.no ? null : c.no)}>
            <span className="chapter-no">{c.no}</span><span className="chapter-title">{c.title}<small>{c.date}</small></span><span className="chapter-type">{c.type}</span><span className="chapter-open">{activeChapter === c.no ? "CLOSE" : "DETAILS"} <ArrowRight size={15}/></span>
            {activeChapter === c.no && <span className="chapter-detail">This is a fan-made chapter guide entry. Add your official reading link or chapter notes here before publishing.</span>}
          </button>)}
          {filtered.length === 0 && <p className="empty-state">No chapters found. Try another keyword.</p>}
        </div>
        <p className="chapter-note"><Sparkles size={14}/> Chapter titles above are editable sample content. Replace them with verified chapter information and official reading links.</p>
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

function ArrowUpRightFallback() {
  return <span className="card-arrow"><ArrowRight size={17}/></span>;
}
