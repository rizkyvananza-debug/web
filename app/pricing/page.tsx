
import Link from "next/link";

const ownerNumber = "31687593822"; // Ganti dengan nomor WhatsApp owner jika berbeda.

const products = [
  {
    number: "01",
    name: "No More Eurydice Bot",
    subtitle: "Cocok untuk fun",
    description:
      "Teman untuk menghidupkan suasana grup WhatsApp. Cocok untuk kamu yang ingin menikmati keseruan bersama teman-teman.",
    prices: [
      { duration: "1 Month", price: "Rp6.000" },
      { duration: "2 Month", price: "Rp12.000" },
      { duration: "Permanent", price: "Rp50.000" },
    ],
    benefits: [
      "Pembelian permanent mendapatkan free User Premium selama 3 bulan untuk 3 orang di grup kamu.",
    ],
    message:
      "Halo Andrew & Luke, saya ingin order No More Eurydice Bot.",
  },
  {
    number: "02",
    name: "Jae Bot",
    subtitle: "Cocok untuk store",
    description:
      "Pilihan bot untuk kebutuhan store dan membantu aktivitas tokomu agar lebih praktis.",
    prices: [
      { duration: "1 Month", price: "Rp3.000" },
      { duration: "2 Month", price: "Rp5.000" },
      { duration: "Permanent", price: "Rp25.000" },
    ],
    benefits: [
      "Bot tahan lama dan tidak mudah mati, kecuali terkena kendala akun/kenon atau masalah server panel.",
    ],
    message:
      "Halo Andrew & Luke, saya ingin order Jae Bot.",
  },
  {
    number: "03",
    name: "User Premium",
    subtitle: "No More Eurydice Bot",
    description:
      "Tingkatkan pengalaman menggunakan No More Eurydice Bot dengan akses premium dan fitur yang lebih leluasa.",
    prices: [
      { duration: "1 Day", price: "Rp1.000" },
      { duration: "7 Days", price: "Rp3.000" },
      { duration: "14 Days", price: "Rp5.000" },
      { duration: "30 Days", price: "Rp10.000" },
      { duration: "60 Days", price: "Rp16.000" },
      { duration: "Permanent", price: "Rp25.000" },
    ],
    benefits: [
      "Unlimited limit.",
      "Bisa chat bot secara pribadi.",
    ],
    message:
      "Halo Andrew & Luke, saya ingin order User Premium No More Eurydice Bot.",
  },
];

function ProductCard({
  product,
}: {
  product: (typeof products)[number];
}) {
  const contactUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(
    product.message
  )}`;

  return (
    <article className="product-price-card">
      <div className="product-card-topline">
        <span>NO. {product.number}</span>
        <span>{product.subtitle}</span>
      </div>

      <h2>{product.name}</h2>

      <p className="product-description">
        {product.description}
      </p>

      <div className="price-options">
        <p className="price-heading">AVAILABLE PACKAGES</p>

        {product.prices.map((item) => (
          <div className="price-option" key={item.duration}>
            <span>{item.duration}</span>
            <strong>{item.price}</strong>
          </div>
        ))}
      </div>

      <div className="product-benefit-area">
        <p className="price-heading">BENEFITS</p>

        <ul className="product-benefits">
          {product.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>

      <a
        className="pricing-order"
        href={contactUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        CONTACT OWNER
        <span>↗</span>
      </a>
    </article>
  );
}

export default function PricingPage() {
  return (
    <main className="subpage pricing-page">
      <div className="subpage-backdrop" />

      <header className="subpage-nav">
        <Link href="/" className="subpage-brand">
          N<span>✦</span>E
          <small>NO MORE EURYDICE</small>
        </Link>

        <Link href="/" className="subpage-home">
          BACK TO HOME
        </Link>
      </header>

      <section className="pricing-wrap pricing-page-wrap">
        <p className="subpage-kicker">
          A LITTLE SOMETHING FOR YOUR DIGITAL WORLD
        </p>

        <div className="ornament">✦ ━━━━━━━━━ ✦</div>

        <h1>
          Service
          <br />
          <em>&amp; Pricelist</em>
        </h1>

        <p className="byline">
          CHOOSE YOUR SERVICE
        </p>

        <p className="pricing-intro">
          Temukan layanan yang sesuai dengan kebutuhanmu.
          Setiap produk memiliki pilihan paket dan benefit
          yang berbeda.
        </p>

        <div className="product-pricing-grid">
          {products.map((product) => (
            <ProductCard
              key={product.number}
              product={product}
            />
          ))}
        </div>

        <p className="subpage-footnote">
          ALL PRICES ARE LISTED IN INDONESIAN RUPIAH.
          CONTACT THE OWNER FOR ORDERING AND INFORMATION.
        </p>
      </section>
    </main>
  );
}
