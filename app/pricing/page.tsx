import Link from "next/link";

const message = "haii aku mau order sewa botnya dongg, info pembayarannya ya kaakk";
const whatsappUrl = `https://wa.me/31687593822?text=${encodeURIComponent(message)}`;

export default function PricingPage() {
  return (
    <main className="subpage">
      <div className="subpage-backdrop" />
      <header className="subpage-nav">
        <Link href="/" className="subpage-brand">N<span>✦</span>E <small>NO MORE EURYDICE</small></Link>
        <Link href="/" className="subpage-home">KEMBALI KE BERANDA</Link>
      </header>
      <section className="pricing-wrap">
        <p className="subpage-kicker">NO MORE EURYDICE · BOT RENTAL</p>
        <div className="ornament">✦ ━━━━━━━━━ ✦</div>
        <h1>Sewa Bot<br /><em>No More Eurydice</em></h1>
        <p className="byline">By Andrew And Luke</p>
        <div className="price-card">
          <span className="price-label">PAKET SEWA</span>
          <strong>6.000<span>/bulan</span></strong>
          <p>Akses sewa bot No More Eurydice selama satu bulan.</p>
          <a className="order-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            ORDER VIA WHATSAPP <span>↗</span>
          </a>
          <small>WhatsApp akan terbuka dengan pesan order yang sudah disiapkan.</small>
        </div>
        <p className="subpage-footnote">Pastikan detail layanan dan pembayaran dikonfirmasi melalui WhatsApp sebelum melakukan pembayaran.</p>
      </section>
    </main>
  );
}
