
'use client';

import Link from 'next/link';
import { useState } from 'react';

type Props = {
  title: string;
  chapterTitle: string;
  slug: string;
  chapterSlug: string;
  previous?: string;
  next?: string;
  pageCount: number;
};

export default function ReaderViewer({
  title,
  chapterTitle,
  slug,
  chapterSlug,
  previous,
  next,
  pageCount,
}: Props) {
  const [failedPages, setFailedPages] = useState<number[]>([]);

  const folder = `/chapters/${slug}/${chapterSlug}`;

  return (
    <main className="reader-page">
      <header className="reader-top">
        <Link
          href={`/list/${slug}`}
          className="reader-back"
        >
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
        <Link href={`/list/${slug}`}>
          Chapter list
        </Link>

        <span>ANDREW STORE YAOI</span>

        <a href="#reader-bottom">
          End of chapter ↓
        </a>
      </div>

      <section className="webtoon-reader">
        {pageCount > 0 ? (
          Array.from({ length: pageCount }, (_, index) => {
            const pageNumber = index + 1;
            const filename = String(pageNumber).padStart(3, '0');

            return (
              <div className="webtoon-page" key={pageNumber}>
                {failedPages.includes(pageNumber) ? (
                  <div className="page-error">
                    <span>✦</span>
                    <p>
                      Page {pageNumber} belum tersedia.
                    </p>
                    <small>
                      Periksa nama dan lokasi file gambarnya.
                    </small>
                  </div>
                ) : (
                  <img
                    src={`${folder}/${filename}.jpg`}
                    alt={`${title} ${chapterTitle} page ${pageNumber}`}
                    loading={pageNumber <= 2 ? 'eager' : 'lazy'}
                    onError={() =>
                      setFailedPages((current) =>
                        current.includes(pageNumber)
                          ? current
                          : [...current, pageNumber]
                      )
                    }
                  />
                )}
              </div>
            );
          })
        ) : (
          <div className="reader-empty">
            <span>✦</span>
            <p className="reader-label">
              ANDREW STORE YAOI · READING ROOM
            </p>
            <h1>{chapterTitle}</h1>
            <p>
              Reader sudah siap. Gambar halaman chapter
              belum ditambahkan.
            </p>
            <small>
              Tambahkan gambar JPG ke folder public/chapters
              untuk mulai membaca.
            </small>
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

          <Link href={`/list/${slug}`}>
            CHAPTER LIST
          </Link>

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
