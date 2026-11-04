
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import "../library.css";

type Props = {
  params: { slug: string };
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export default async function ManhwaDetailPage({ params }: Props) {
  const supabase = getSupabase();

  const { data: manhwa, error } = await supabase
    .from("manhwa_series")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !manhwa) notFound();

  const { data: chapters, error: chapterError } = await supabase
    .from("manhwa_chapters")
    .select("id,chapter_number,title,created_at")
    .eq("series_id", manhwa.id)
    .eq("is_published", true)
    .order("chapter_number", { ascending: false });

  if (chapterError) {
    throw new Error("Gagal mengambil daftar chapter.");
  }

  const genreList: string[] = Array.isArray(manhwa.genres)
    ? manhwa.genres
    : [];

  return (
    <main className="library-page detail-page">
      <div className="library-shell">
        <header className="library-header">
          <Link href="/" className="library-brand">
            N<span>✦</span>E <small>ANDREW STORE YAOI</small>
          </Link>
          <Link href="/list" className="back-home">← Library</Link>
        </header>

        <nav className="breadcrumbs">
          <Link href="/">HOME</Link>
          <span>/</span>
          <Link href="/list">COLLECTION</Link>
          <span>/</span>
          <span>{manhwa.title.toUpperCase()}</span>
        </nav>

        <section className="detail-hero">
          <div className="detail-cover">
            <div className="cover-art">
              {manhwa.cover_url ? (
                <img
                  src={manhwa.cover_url}
                  alt={manhwa.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <span className="cover-ornament">✦</span>
                  <span className="cover-title">{manhwa.title}</span>
                  <span className="cover-bottom">ANDREW STORE YAOI · ARCHIVE</span>
                </>
              )}
            </div>
          </div>

          <div className="detail-copy">
            <p className="eyebrow">A STORY FROM THE ARCHIVE</p>
            <h1>{manhwa.title}</h1>

            <div className="detail-tags">
              {genreList.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>

            <p className="detail-synopsis">
              {manhwa.synopsis || "Belum ada sinopsis."}
            </p>

            <dl className="detail-facts">
              <div>
                <dt>AUTHOR</dt>
                <dd>{manhwa.author || "Unknown"}</dd>
              </div>
              <div>
                <dt>ARTIST</dt>
                <dd>{manhwa.artist || "Unknown"}</dd>
              </div>
              <div>
                <dt>STATUS</dt>
                <dd>{manhwa.status || "Unknown"}</dd>
              </div>
              <div>
                <dt>CHAPTERS</dt>
                <dd>{chapters?.length || 0}</dd>
              </div>
            </dl>

            <a className="start-reading" href="#chapters">
              EXPLORE CHAPTERS <span>↓</span>
            </a>
          </div>
        </section>

        <section id="chapters" className="chapter-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE READING ROOM</p>
              <h2>
                Chapters{" "}
                <span>
                  ({String(chapters?.length || 0).padStart(2, "0")})
                </span>
              </h2>
            </div>
            <p className="sort-note">SELECT A CHAPTER TO BEGIN</p>
          </div>

          {!chapters || chapters.length === 0 ? (
            <p className="chapter-note">
              Belum ada chapter yang dipublikasikan.
            </p>
          ) : (
            <div className="chapter-list">
              {chapters.map((chapter, index) => (
                <Link
                  href={`/read/${manhwa.slug}/${chapter.id}`}
                  className="chapter-row"
                  key={chapter.id}
                >
                  <span className="chapter-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="chapter-name">
                    {chapter.title || `Chapter ${chapter.chapter_number}`}
                  </span>
                  <span className="chapter-date">READ CHAPTER</span>
                  <span className="chapter-arrow">↗</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <footer className="library-footer">
          <span>✦</span>
          <p>ENDLESS STORIES, QUIETLY KEPT.</p>
          <span>✦</span>
        </footer>
      </div>
    </main>
  );
}
