'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { manhwaList } from '../../data/manhwa';
import './library.css';

export default function ManhwaLibraryPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const genres = ['All', 'Boys’ Love', 'Romance', 'Drama', 'Psychological', 'Comedy'];

  const filtered = useMemo(() => manhwaList.filter((item) => {
    const matchesQuery = `${item.title} ${item.author}`.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = genre === 'All' || item.genres.includes(genre);
    return matchesQuery && matchesGenre;
  }), [query, genre]);

  return (
    <main className="library-page">
      <div className="library-shell">
        <header className="library-header">
          <Link href="/" className="library-brand">N<span>✦</span>E <small>ANDREW STORE YAOI</small></Link>
          <Link href="/" className="back-home">← Home</Link>
        </header>

        <section className="library-intro">
          <p className="eyebrow">THE PRIVATE READING ROOM · EST. 2026</p>
          <h1>Stories kept<br /><em>between the lines.</em></h1>
          <p className="intro-copy">A curated archive of romance, longing, and beautifully complicated hearts.</p>
          <div className="intro-rule"><span>✦</span></div>
        </section>

        <section className="library-controls" aria-label="Manhwa filters">
          <label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a title or creator…" /></label>
          <div className="genre-tabs">{genres.map((item) => <button key={item} className={genre === item ? 'active' : ''} onClick={() => setGenre(item)}>{item}</button>)}</div>
        </section>

        <div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Featured manhwa <span>({filtered.length.toString().padStart(2, '0')})</span></h2></div><p className="sort-note">A SMALL, HAND-PICKED LIBRARY</p></div>

        <section className="manhwa-grid">
          {filtered.map((item, index) => (
            <article className={`manhwa-card ${item.accent}`} key={item.slug}>
              <Link href={`/list/${item.slug}`} className="cover-link" aria-label={`Open ${item.title}`}>
                <div className="cover-art">
                  <span className="cover-index">N° 0{index + 1}</span>
                  <span className="cover-ornament">✦</span>
                  <span className="cover-title">{item.title}</span>
                  <span className="cover-author">A STORY BY {item.author.toUpperCase()}</span>
                  <span className="cover-bottom">ANDREW STORE YAOI · ARCHIVE</span>
                </div>
              </Link>
              <div className="card-info">
                <div className="card-title-row"><div><p className="card-kicker">{item.alternateTitle}</p><h3><Link href={`/list/${item.slug}`}>{item.title}</Link></h3></div><span className="status-dot">{item.status}</span></div>
                <p className="card-meta">{item.author} <span>·</span> {item.year}</p>
                <div className="card-genres">{item.genres.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                <Link className="discover-link" href={`/list/${item.slug}`}>DISCOVER STORY <span>↗</span></Link>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="empty-state">No stories found. Try another title or genre.</p>}
        </section>

        <footer className="library-footer"><span>✦</span><p>READ SLOWLY. FEEL EVERYTHING.</p><span>✦</span></footer>
      </div>
    </main>
  );
}
