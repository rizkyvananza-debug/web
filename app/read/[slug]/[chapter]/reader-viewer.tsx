
"use client";

import Link from "next/link";

type Props = {
  title: string;
  chapterTitle: string;
  slug: string;
  chapterId: string;
  previous?: string;
  next?: string;
  imageUrls: string[];
};

export default function ReaderViewer({
  title,
  chapterTitle,
  slug,
  previous,
  next,
  imageUrls,
}: Props) {
  return (
    <main className="reader-page">
      <header className="reader-top">
        <Link href={`/list/${slug}`} className="reader-back">
          ← DETAILS
        </Link>

        <div>
          <strong>{title}</strong>
          <span>{chapterTitle}</span>
        </div>

        <Link href="/list" className="reader-library">
          LIBRARY
        </Link>
      </header>

      <div className="reader-toolbar">
        <Link href={`/list/${slug}`}>Chapter list</Link>
        <span>ANDREW STORE YAOI</span>
        <a href="#reader-bottom">End of chapter ↓</a>
      </div>

      <section className="webtoon-reader">
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <div className="webtoon-page" key={`${url}-${index}`}>
              <img
                src={url}
                alt={`${title} ${chapterTitle} page ${index + 1}`}
                loading={index < 2 ? "eager" : "lazy"}
              />
            </div>
          ))
        ) : (
          <div className="reader-empty">
            <span>✦</span>
            <p className="reader-label">
              ANDREW STORE YAOI · READING ROOM
            </p>
            <h1>{chapterTitle}</h1>
            <p>Halaman untuk chapter ini belum tersedia.</p>
          </div>
        )}
      </section>

      <footer className="reader-bottom" id="reader-bottom">
        <p>YOU HAVE REACHED THE END</p>
        <h2>{chapterTitle}</h2>

        <div className="reader-navigation">
          {previous ? (
            <Link href={`/read/${slug}/${previous}`}>
              ← PREVIOUS
            </Link>
          ) : (
            <span className="disabled">← PREVIOUS</span>
          )}

          <Link href={`/list/${slug}`}>CHAPTER LIST</Link>

          {next ? (
            <Link href={`/read/${slug}/${next}`}>
              NEXT CHAPTER →
            </Link>
          ) : (
            <span className="disabled">NEXT CHAPTER →</span>
          )}
        </div>
      </footer>
    </main>
  );
}
