import Link from "next/link";

export default function AboutOwnerPage() {
  return (
    <main className="subpage">
      <div className="subpage-backdrop" />
      <header className="subpage-nav">
        <Link href="/" className="subpage-brand">N<span>✦</span>E <small>NO MORE EURYDICE</small></Link>
        <Link href="/" className="subpage-home">KEMBALI KE BERANDA</Link>
      </header>
      <section className="pricing-wrap about-owner-wrap">
        <p className="subpage-kicker">BEHIND THE PROJECT</p>
        <div className="ornament">✦ ━━━━━━━━━ ✦</div>
        <h1>About<br /><em>the Owners</em></h1>
        <p className="byline">By Andrew And Luke</p>
        <div className="price-card owner-card">
          <span className="price-label">THE PEOPLE BEHIND THIS SERVICE</span>
          <h2>Andrew <span>&</span> Luke</h2>
          <p>Pengelola layanan sewa bot No More Eurydice.</p>
          <a className="order-button" href="https://wa.me/31687593822" target="_blank" rel="noopener noreferrer">CONTACT VIA WHATSAPP <span>↗</span></a>
        </div>
      </section>
    </main>
  );
}
