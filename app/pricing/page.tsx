
const OWNER_CONTACT = "https://wa.me/31687593822";
// Ganti dengan link WhatsApp owner yang sebenarnya.

const products = [
  {
    number: "NO. 01",
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
  },
  {
    number: "NO. 02",
    name: "Jae Bot",
    subtitle: "Cocok untuk store",
    description:
      "Bot praktis untuk membantu kebutuhan store dan aktivitas WhatsApp kamu.",
    prices: [
      { duration: "1 Month", price: "Rp3.000" },
      { duration: "2 Month", price: "Rp5.000" },
      { duration: "Permanent", price: "Rp25.000" },
    ],
    benefits: [
      "Bot tahan lama dan tidak mudah mati, kecuali terkena kendala koneksi atau masalah server panel.",
    ],
  },
  {
    number: "NO. 03",
    name: "User Premium",
    subtitle: "No More Eurydice Bot",
    description:
      "Nikmati pengalaman menggunakan bot dengan akses premium dan fitur tambahan.",
    prices: [
      { duration: "1 Day", price: "Rp1.000" },
      { duration: "7 Day", price: "Rp3.000" },
      { duration: "14 Day", price: "Rp5.000" },
      { duration: "30 Day", price: "Rp10.000" },
      { duration: "60 Day", price: "Rp16.000" },
      { duration: "Permanent", price: "Rp25.000" },
    ],
    benefits: [
      "Unlimited limit",
      "Bisa chat bot secara pribadi",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#101b18] text-[#eee8df]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        {/* HEADER */}
        <header className="mb-14 text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#d9aebc]">
            A little something for your digital world
          </p>

          <div className="mb-5 flex items-center justify-center gap-4 text-[#d9aebc]">
            <span className="h-px w-12 bg-[#d9aebc]" />
            ✦ ───────── ✦
            <span className="h-px w-12 bg-[#d9aebc]" />
          </div>

          <h1 className="font-serif text-5xl leading-tight sm:text-7xl">
            Service
            <br />
            <span className="italic text-[#e8b9c8]">& Pricelist</span>
          </h1>

          <p className="mt-5 text-sm tracking-[0.2em] text-[#d9c8c4]">
            CHOOSE YOUR SERVICE
          </p>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#c9d0ca] sm:text-base">
            Temukan layanan yang sesuai dengan kebutuhanmu.
            Setiap produk memiliki pilihan paket dan benefit
            yang berbeda.
          </p>
        </header>

        {/* PRODUCT CARDS */}
        <section className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.number}
              className="flex flex-col rounded-sm border border-[#c99eaa]/50 bg-[#1a2924]/90 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-[#e8b9c8]"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.3em] text-[#d9aebc]">
                  {product.number}
                </span>
                <span className="text-xl text-[#d9aebc]">✦</span>
              </div>

              <h2 className="font-serif text-2xl leading-snug text-[#f1e9df]">
                {product.name}
              </h2>

              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#e3aebe]">
                {product.subtitle}
              </p>

              <p className="mt-5 min-h-20 text-sm leading-7 text-[#c9d0ca]">
                {product.description}
              </p>

              <div className="my-6 h-px bg-[#c99eaa]/40" />

              <h3 className="mb-4 text-xs tracking-[0.25em] text-[#e3aebe]">
                AVAILABLE PACKAGES
              </h3>

              <div className="space-y-3">
                {product.prices.map((item) => (
                  <div
                    key={item.duration}
                    className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 text-sm"
                  >
                    <span className="text-[#d6d9d2]">
                      {item.duration}
                    </span>
                    <span className="font-semibold text-[#f0c3d0]">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <h3 className="mb-3 text-xs tracking-[0.25em] text-[#e3aebe]">
                  BENEFITS
                </h3>

                <ul className="space-y-3">
                  {product.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-3 text-sm leading-6 text-[#d0d7d0]"
                    >
                      <span className="text-[#e8b9c8]">✦</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <a
                  href={OWNER_CONTACT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 w-full items-center justify-center border border-[#e8b9c8] bg-[#e8b9c8] px-4 py-3 text-center text-xs font-semibold tracking-[0.16em] text-[#17231f] transition hover:bg-transparent hover:text-[#f0c3d0]"
                >
                  CONTACT OWNER
                </a>
              </div>
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
        </footer>
      </div>
    </main>
  );
}
