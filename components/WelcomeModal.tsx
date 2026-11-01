
"use client";

import { useEffect, useState } from "react";
import { X, Star, Flower2, Music2 } from "lucide-react";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  function dismiss() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <button className="welcome-backdrop" aria-label="Tutup popup" onClick={dismiss} />
      <section className="welcome-card">
        <button className="welcome-close" onClick={dismiss} aria-label="Tutup">
          <X size={25} />
        </button>

        <div className="welcome-art" role="img" aria-label="Ilustrasi piano dan lotus" />

        <div className="welcome-kicker">
          <Music2 size={13}/> A LITTLE NOTE FROM US <Flower2 size={13}/>
        </div>

        <h2 id="welcome-title">
          Welcome to<br/><em>our little garden.</em>
        </h2>

        <p className="welcome-copy">
          Ikuti saluran kami untuk melihat testimoni, informasi layanan, dan update terbaru seputar No More Eurydice Bot.
        </p>

        <a className="welcome-action primary" href="https://t.me/andrewstesti" target="_blank" rel="noopener noreferrer" onClick={dismiss}>
          <Star size={20} fill="currentColor"/> Join Saluran Testimoni
        </a>

        <a className="welcome-action secondary" href="https://whatsapp.com/channel/0029Vb6K4eK05MUcYeD9Qq0W" target="_blank" rel="noopener noreferrer" onClick={dismiss}>
          <Star size={20} fill="currentColor"/> Join Saluran Informasi
        </a>

        <div className="welcome-foot">
          PIANO NOTES & LOTUS BLOOMS · NO MORE EURYDICE
        </div>
      </section>
    </div>
  );
}
