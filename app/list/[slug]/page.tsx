import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getManhwa, manhwaList } from '../../../data/manhwa';
import '../library.css';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return manhwaList.map((item) => ({ slug: item.slug }));
}

export default function ManhwaDetailPage({ params }: Props) {
  const manhwa = getManhwa(params.slug);
  if (!manhwa) notFound();

  return (
    <main className="library-page detail-page">
      <div className="library-shell">
        <header className="library-header"><Link href="/" className="library-brand">N<span>✦</span>E <small>ANDREW STORE YAOI</small></Link><Link href="/list" className="back-home">← Library</Link></header>
        <nav className="breadcrumbs"><Link href="/">HOME</Link><span>/</span><Link href="/list">COLLECTION</Link><span>/</span><span>{manhwa.title.toUpperCase()}</span></nav>
        <section className={`detail-hero ${manhwa.accent}`}>
          <div className="detail-cover"><div className="cover-art"><span className="cover-index">ARCHIVE · 00{manhwaList.findIndex((x) => x.slug === manhwa.slug) + 1}</span><span className="cover-ornament">✦</span><span className="cover-title">{manhwa.title}</span><span className="cover-author">A STORY BY {manhwa.author.toUpperCase()}</span><span className="cover-bottom">ANDREW STORE YAOI · ARCHIVE</span></div></div>
          <div className="detail-copy"><p className="eyebrow">A STORY FROM THE ARCHIVE</p><h1>{manhwa.title}</h1><p className="alternate-title">{manhwa.alternateTitle}</p><div className="detail-tags">{manhwa.genres.map((tag) => <span key={tag}>{tag}</span>)}</div><p className="detail-synopsis">{manhwa.synopsis}</p><dl className="detail-facts"><div><dt>CREATOR</dt><dd>{manhwa.author}</dd></div><div><dt>STATUS</dt><dd>{manhwa.status}</dd></div><div><dt>YEAR</dt><dd>{manhwa.year}</dd></div></dl><a className="start-reading" href={`#chapters`}>EXPLORE CHAPTERS <span>↓</span></a></div>
        </section>
        <section id="chapters" className="chapter-section"><div className="section-heading"><div><p className="eyebrow">THE READING ROOM</p><h2>Chapters <span>({manhwa.chapters.length.toString().padStart(2, '0')})</span></h2></div><p className="sort-note">SELECT A CHAPTER TO BEGIN</p></div><div className="chapter-list">{manhwa.chapters.map((chapter, index) => <Link href={`/read/${manhwa.slug}/${chapter.slug}`} className="chapter-row" key={chapter.slug}><span className="chapter-number">{String(index + 1).padStart(2, '0')}</span><span className="chapter-name">{chapter.title}</span><span className="chapter-date">READ CHAPTER</span><span className="chapter-arrow">↗</span></Link>)}</div><p className="chapter-note">Chapter entries are starter placeholders. Add your licensed or otherwise authorized chapter images before publishing the reader.</p></section>
        <footer className="library-footer"><span>✦</span><p>ENDLESS STORIES, QUIETLY KEPT.</p><span>✦</span></footer>
      </div>
    </main>
  );
}
