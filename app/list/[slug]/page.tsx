
import Link from "next/link";
import { notFound } from "next/navigation";

const stories = {
  "no-more-eurydice001": {
    title: "No More Eurydice",
    subtitle: "A Tale of Love, Loss & Redemption",
    author: "Baek Daekal",
    status: "Ongoing",
    rating: "9.8",
    genres: ["Boys Love", "Drama", "Psychological", "Romance", "Adult"],
    symbol: "N✦E",
    description:
      "Han Garam enrolls in a prestigious arts university at the heart of Korea's classical music scene. His academic advisor, Professor Kim Heejae, a world-famous pianist, exploits Han Garam's passion for his own ambition. What begins with music becomes a story of complicated feelings, ambition, and pain.",
    quote: "What you hold dearest will become your greatest pain.",
    color: "eurydice",
  },

  "the-dangerous-convenience-store002": {
    title: "The Dangerous Convenience Store",
    subtitle: "A Dangerous Kind of Love",
    author: "945",
    status: "Completed",
    rating: "9.7",
    genres: ["Boys Love", "Romance", "Comedy", "Gangster", "Mature"],
    symbol: "危",
    description:
      "Yeo Eui-joon is a college student working the graveyard shift at a convenience store to pay his bills. Most of the customers are gangsters and hoodlums. One of them is Bum Geon-woo, a tall and intimidating gangster who seems to have a soft spot for Eui-joon. As Geon-woo repeatedly protects him, their unexpected relationship begins to grow.",
    quote: "Sometimes the most unexpected person becomes your safest place.",
    color: "dangerous",
  },
};

type StorySlug = keyof typeof stories;

export function generateStaticParams() {
  return Object.keys(stories).map((slug) => ({ slug }));
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in stories)) {
    notFound();
  }

  const story = stories[slug as StorySlug];

  return (
    <main className="story-detail">
      <header className="detail-header">
        <Link href="/" className="detail-logo">
          N<span>✦</span>E
          <small>A GOTHIC ROMANCE ARCHIVE</small>
        </Link>

        <Link href="/list" className="detail-back">
          ← STORY ARCHIVE
        </Link>
      </header>

      <section className={`detail-hero ${story.color}`}>
        <div className="detail-cover">
          <span>N✦E ARCHIVE</span>
          <strong>{story.symbol}</strong>
          <h2>{story.title}</h2>
          <small>{story.subtitle}</small>
        </div>

        <div className="detail-intro">
          <p className="detail-kicker">THE STORY COLLECTION</p>

          <h1>{story.title}</h1>

          <p className="detail-subtitle">{story.subtitle}</p>

          <div className="detail-rating">
            <span>★ {story.rating}/10</span>
            <span>·</span>
            <span>{story.status}</span>
          </div>

          <div className="detail-genres">
            {story.genres.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>

          <p className="detail-author">
            STORY & ART BY <strong>{story.author}</strong>
          </p>
        </div>
      </section>

      <section className="detail-content">
        <p className="detail-kicker">ABOUT THIS STORY</p>
        <h2>Between <em>Love & Memories</em></h2>

        <p className="detail-description">
          {story.description}
        </p>

        <blockquote>
          “{story.quote}”
        </blockquote>

        <div className="detail-notice">
          <span>✦</span>
          <p>
            This story contains mature themes. Please check the
            content rating before reading.
          </p>
        </div>

        <div className="detail-actions">
          <Link href="/#chapters" className="detail-primary">
            READ CHAPTERS ↗
          </Link>

          <Link href="/list" className="detail-secondary">
            BACK TO ARCHIVE
          </Link>
        </div>
      </section>

      <footer className="detail-footer">
        <div>N<span>✦</span>E</div>
        <p>A GOTHIC ROMANCE ARCHIVE</p>
        <small>© 2026 NO MORE EURYDICE. ALL RIGHTS RESERVED.</small>
      </footer>

      <style jsx>{`
        .story-detail {
          min-height: 100vh;
          background: #071e1a;
          color: #f1ead8;
          font-family: Georgia, "Times New Roman", serif;
        }

        .detail-header {
          min-height: 78px;
          padding: 12px 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(201,173,104,.5);
          background: #061914;
        }

        .detail-logo {
          font-size: 30px;
          letter-spacing: 4px;
        }

        .detail-logo span,
        .detail-footer span {
          color: #c9ad68;
        }

        .detail-logo small {
          display: block;
          font: 8px Arial, sans-serif;
          letter-spacing: 2px;
        }

        .detail-back {
          padding: 12px 15px;
          border: 1px solid #c9ad68;
          font: 10px Arial, sans-serif;
          letter-spacing: 1px;
        }

        .detail-hero {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 55px;
          align-items: center;
          padding: 75px 10%;
          background:
            radial-gradient(ellipse at 75% 30%, #174638, transparent 60%),
            #09251f;
        }

        .detail-cover {
          min-height: 420px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          border: 1px solid #c9ad68;
          box-shadow: 0 20px 60px #0008;
          background:
            linear-gradient(180deg, #071e1a55, #071e1add),
            radial-gradient(circle at center, #6b3549, #102e27 75%);
        }

        .dangerous .detail-cover {
          background:
            linear-gradient(180deg, #071e1a55, #071e1add),
            radial-gradient(circle at center, #743d42, #172a25 75%);
        }

        .detail-cover span,
        .detail-cover small {
          font-size: 9px;
          letter-spacing: 3px;
        }

        .detail-cover strong {
          font-size: 76px;
          color: #e5b9bb;
          font-weight: 400;
        }

        .detail-cover h2 {
          font-size: 34px;
          font-weight: 400;
          line-height: 1.1;
          margin: 0;
        }

        .detail-intro {
          max-width: 620px;
        }

        .detail-kicker {
          color: #e0cb91;
          font: 10px Arial, sans-serif;
          letter-spacing: 3px;
        }

        .detail-intro h1 {
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1.05;
          font-weight: 400;
          margin: 20px 0 12px;
        }

        .detail-subtitle {
          color: #e5b9bb;
          font-style: italic;
          font-size: 19px;
        }

        .detail-rating {
          display: flex;
          gap: 14px;
          margin: 25px 0;
          color: #e0cb91;
          font-size: 14px;
        }

        .detail-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .detail-genres span {
          padding: 9px 13px;
          border: 1px solid rgba(201,173,104,.5);
          background: #071e1a88;
          font: 10px Arial, sans-serif;
        }

        .detail-author {
          margin-top: 30px;
          color: #b8c5b5;
          font: 10px Arial, sans-serif;
          letter-spacing: 2px;
        }

        .detail-author strong {
          color: #f1ead8;
          margin-left: 8px;
        }

        .detail-content {
          max-width: 850px;
          margin: auto;
          padding: 75px 25px;
          text-align: center;
        }

        .detail-content h2 {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 400;
          margin: 18px 0 25px;
        }

        .detail-content h2 em {
          color: #e5b9bb;
        }

        .detail-description {
          color: #d0d9cc;
          font-size: 16px;
          line-height: 2;
        }

        blockquote {
          margin: 40px 0;
          padding: 25px;
          border-top: 1px solid #c9ad68;
          border-bottom: 1px solid #c9ad68;
          color: #e5b9bb;
          font-size: 22px;
          font-style: italic;
          line-height: 1.6;
        }

        .detail-notice {
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: center;
          padding: 17px;
          border: 1px solid rgba(201,173,104,.35);
          color: #d0d9cc;
          font: 12px/1.6 Arial, sans-serif;
        }

        .detail-notice span {
          color: #e0cb91;
        }

        .detail-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 35px;
        }

        .detail-actions a {
          padding: 17px 25px;
          font: 10px Arial, sans-serif;
          letter-spacing: 1.5px;
        }

        .detail-primary {
          background: #9c596d;
          color: white;
        }

        .detail-secondary {
          border: 1px solid #c9ad68;
        }

        .detail-footer {
          padding: 40px 20px;
          text-align: center;
          background: #061914;
          border-top: 1px solid rgba(201,173,104,.5);
        }

        .detail-footer div {
          font-size: 30px;
          letter-spacing: 4px;
        }

        .detail-footer p {
          color: #e0cb91;
          font: 9px Arial, sans-serif;
          letter-spacing: 3px;
        }

        .detail-footer small {
          color: #a9b9aa;
          font: 9px Arial, sans-serif;
        }

        @media (max-width: 700px) {
          .detail-header {
            min-height: 65px;
            padding: 10px 18px;
          }

          .detail-logo {
            font-size: 24px;
          }

          .detail-logo small {
            font-size: 6px;
          }

          .detail-back {
            padding: 10px;
            font-size: 8px;
          }

          .detail-hero {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 35px 22px 45px;
          }

          .detail-cover {
            width: min(230px, 75%);
            min-height: 310px;
            margin: auto;
          }

          .detail-cover h2 {
            font-size: 27px;
          }

          .detail-cover strong {
            font-size: 60px;
          }

          .detail-intro {
            text-align: center;
          }

          .detail-intro h1 {
            font-size: 42px;
          }

          .detail-genres {
            justify-content: center;
          }

          .detail-content {
            padding: 55px 22px;
          }

          .detail-description {
            font-size: 14px;
            line-height: 1.8;
          }

          blockquote {
            font-size: 18px;
          }

          .detail-actions {
            flex-direction: column;
          }

          .detail-actions a {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
