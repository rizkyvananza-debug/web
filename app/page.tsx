
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ShoppingBag,
  UserRound,
  Sparkles,
  Flower2,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="al-home">
      <header className="al-header">
        <Link href="/" className="al-logo">
          <span>A <i>✦</i> L</span>
          <small>ANDREW & LUKE</small>
        </Link>

        <nav className="al-nav">
          <Link href="/">Home</Link>
          <Link href="/pricing">Order Now</Link>
          <Link href="/aboutowner">About Owner</Link>
          <Link href="/list">Reading List</Link>
        </nav>
      </header>

      <section className="al-hero">
        <div className="al-hero-image" />
        <div className="al-hero-content">
          <p className="al-eyebrow">
            <Sparkles size={14} /> A LITTLE STORE BY ANDREW & LUKE
          </p>

          <h1>
            Andrew <span>&</span>
            <em>Luke.</em>
          </h1>

          <div className="al-line" />

          <p className="al-description">
            A little place for stories, services, and things we love.
            Dikelola dengan hangat oleh Andrew & Luke.
          </p>

          <div className="al-buttons">
            <Link href="/pricing" className="al-button al-button-primary">
              <ShoppingBag size={19} />
              ORDER NOW
              <ArrowRight size={17} />
            </Link>

            <Link href="/aboutowner" className="al-button al-button-outline">
              <UserRound size={19} />
              ABOUT OWNER
            </Link>
          </div>

          <Link href="/list" className="al-list-button">
            <BookOpen size={20} />
            MANHWA · MANGA · MANHUA LIST
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="al-hero-caption">
          NO MORE EURYDICE · STORIES BEYOND WORDS
        </div>
      </section>

      <section className="al-intro">
        <div className="al-section-heading">
          <span>✦</span>
          <p>WELCOME TO OUR LITTLE WORLD</p>
          <span>✦</span>
        </div>

        <h2>A space made with <em>love.</em></h2>
        <p>
          Temukan layanan, kenali pemilik toko, dan jelajahi
          berbagai cerita favorit dalam satu tempat.
        </p>

        <div className="al-feature-grid">
          <Link href="/pricing" className="al-feature-card">
            <ShoppingBag size={27} />
            <h3>Order Now</h3>
            <p>
              Temukan layanan sewa bot, User Premium,
              dan informasi harga.
            </p>
            <span>EXPLORE SERVICES <ArrowRight size={15} /></span>
          </Link>

          <Link href="/aboutowner" className="al-feature-card">
            <UserRound size={27} />
            <h3>About Owner</h3>
            <p>
              Kenali Andrew & Luke lebih dekat
              sebagai pengelola Andrew Store.
            </p>
            <span>MEET THE OWNERS <ArrowRight size={15} /></span>
          </Link>

          <Link href="/list" className="al-feature-card">
            <BookOpen size={27} />
            <h3>Reading List</h3>
            <p>
              Jelajahi koleksi dan rekomendasi
              Manhwa, Manga, serta Manhua.
            </p>
            <span>VIEW THE LIST <ArrowRight size={15} /></span>
          </Link>
        </div>
      </section>

      <section className="al-story">
        <div className="al-story-image" />
        <div className="al-story-copy">
          <Flower2 size={30} />
          <p className="al-eyebrow">A NOTE FROM ANDREW & LUKE</p>
          <h2>
            “Every story
            <em> leaves a little light.</em>”
          </h2>
          <p>
            Terima kasih sudah menjadi bagian dari ruang kecil kami.
            Semoga kamu menemukan sesuatu yang kamu sukai di sini.
          </p>
          <Link href="/list" className="al-text-link">
            EXPLORE OUR READING LIST <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="al-footer">
        <Link href="/" className="al-logo">
          <span>A <i>✦</i> L</span>
          <small>ANDREW & LUKE</small>
        </Link>
        <p>MADE WITH LOVE · ANDREW STORE YAOI</p>
        <div>
          <Link href="/pricing">Order Now</Link>
          <Link href="/aboutowner">About Owner</Link>
          <Link href="/list">Reading List</Link>
        </div>
        <small>© {new Date().getFullYear()} Andrew & Luke</small>
      </footer>
    </main>
  );
}
