
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./list.css";

type Comic = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  genre: string[];
  status: "Ongoing" | "Completed";
  rating: string;
  chapter: string;
  color: string;
  symbol: string;
  description: string;
};

const comics: Comic[] = [
  {
    id: 1,
    slug: "no-more-eurydice001",
    title: "No More Eurydice",
    subtitle: "A Tale of Love, Loss & Redemption",
    author: "Baek Daekal",
    genre: ["Boys Love", "Drama", "Psychological", "Romance"],
    status: "Ongoing",
    rating: "9.8",
    chapter: "Chapter 12",
    color: "cover-one",
    symbol: "N✦E",
    description:
      "Han Garam enters a prestigious arts university, where his passion for classical music brings him close to Professor Kim Heejae, a world-renowned pianist. But behind the beauty of music lies ambition, manipulation, and a story of love and pain.",
  },
  {
    id: 2,
    slug: "the-dangerous-convenience-store002",
    title: "The Dangerous Convenience Store",
    subtitle: "A Dangerous Kind of Love",
    author: "945",
    genre: ["Boys Love", "Romance", "Comedy", "Drama"],
    status: "Completed",
    rating: "9.7",
    chapter: "Completed",
    color: "cover-two",
    symbol: "危",
    description:
      "Yeo Eui-joon works the night shift at a convenience store frequented by gangsters. Among its dangerous customers is Bum Geon-woo, an intimidating man who seems to have a special soft spot for him. As their paths cross, an unexpected romance begins.",
  },
];

const genres = [
  "All",
  "Boys Love",
  "Romance",
  "Drama",
  "Psychological",
  "Comedy",
];

export default function ListPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Latest");

  const filteredComics = useMemo(() => {
    let result = comics.filter((comic) => {
      const matchesSearch =
        comic.title.toLowerCase().includes(search.toLowerCase()) ||
        comic.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        comic.author.toLowerCase().includes(search.toLowerCase());

      const matchesGenre =
        genre === "All" || comic.genre.includes(genre);

      const matchesStatus =
        status === "All" || comic.status === status;

      return matchesSearch && matchesGenre && matchesStatus;
    });

    if (sort === "Rating") {
      result = [...result].sort(
        (a, b) => Number(b.rating) - Number(a.rating)
      );
    }

    if (sort === "A-Z") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [search, genre, status, sort]);

  return (
    <main className="library-page">
      <header className="library-header">
        <Link href="/" className="library-logo">
          N<span>✦</span>E
          <small>A GOTHIC ROMANCE ARCHIVE</small>
        </Link>

        <Link href="/" className="library-home">
          ← HOME
        </Link>
      </header>

      <section className="library-hero">
        <p className="library-eyebrow">
          THE COLLECTION · EST. 2026
        </p>

        <h1>
          Story <em>Archive.</em>
        </h1>

        <p>
          Discover stories written between love, loss,
          memories, and everything left unsaid.
        </p>

        <div className="library-stats">
          <div>
            <strong>{comics.length.toString().padStart(2, "0")}</strong>
            <span>STORIES</span>
          </div>

          <div>
            <strong>06</strong>
            <span>GENRES</span>
          </div>

          <div>
            <strong>∞</strong>
            <span>MEMORIES</span>
          </div>
        </div>
      </section>

      <section className="library-content">
        <div className="library-section-title">
          <div>
            <span className="library-small-label">
              EXPLORE THE COLLECTION
            </span>
            <h2>
              All <em>Stories</em>
            </h2>
          </div>

          <span className="result-count">
            {filteredComics.length} RESULTS
          </span>
        </div>

        <div className="library-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search your next story..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="library-filters">
          <div className="filter-label">GENRE</div>

          <div className="genre-list">
            {genres.map((item) => (
              <button
                key={item}
                onClick={() => setGenre(item)}
                className={genre === item ? "genre-active" : ""}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="filter-row">
            <label>
              STATUS
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">All Stories</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label>
              SORT BY
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="Latest">Latest</option>
                <option value="Rating">Highest Rating</option>
                <option value="A-Z">A - Z</option>
              </select>
            </label>
          </div>
        </div>

        <div className="comic-grid">
          {filteredComics.map((comic) => (
            <article className="comic-card" key={comic.id}>
              <div className={`comic-cover ${comic.color}`}>
                <span className="cover-top">N✦E ARCHIVE</span>

                <div className="cover-symbol">
                  {comic.symbol}
                </div>

                <div className="cover-title">
                  <h3>{comic.title}</h3>
                  <p>{comic.subtitle}</p>
                </div>

                <span className="cover-bottom">
                  A STORY OF LOVE & MEMORIES
                </span>

                <span className="comic-status">
                  {comic.status}
                </span>
              </div>

              <div className="comic-details">
                <div className="comic-title-row">
                  <h3>{comic.title}</h3>
                  <span className="comic-rating">
                    ★ {comic.rating}
                  </span>
                </div>

                <p className="comic-description">
                  {comic.description}
                </p>

                <div className="comic-genres">
                  {comic.genre.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="comic-bottom">
                  <span>{comic.chapter}</span>

                  <Link href={`/list/${comic.slug}`}>
                    VIEW STORY ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredComics.length === 0 && (
          <div className="library-empty">
            <span>✧</span>
            <h3>No stories found</h3>
            <p>Try another title or change your filters.</p>

            <button
              onClick={() => {
                setSearch("");
                setGenre("All");
                setStatus("All");
              }}
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </section>

      <footer className="library-footer">
        <div className="footer-logo">
          N<span>✦</span>E
        </div>

        <p>A GOTHIC ROMANCE ARCHIVE</p>
        <span>© 2026 NO MORE EURYDICE. ALL RIGHTS RESERVED.</span>

        <Link href="/">BACK TO HOME ↑</Link>
      </footer>
    </main>
  );
}
