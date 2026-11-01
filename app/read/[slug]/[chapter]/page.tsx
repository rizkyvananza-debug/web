
import { notFound } from 'next/navigation';
import { getManhwa, manhwaList } from '../../../../data/manhwa';
import ReaderViewer from './reader-viewer';

type Props = {
  params: {
    slug: string;
    chapter: string;
  };
};

const chapterPageCounts: Record<string, number> = {
  'no-more-eurydice/chapter-1': 0,
  'no-more-eurydice/chapter-2': 0,
  'no-more-eurydice/chapter-3': 0,

  'the-dangerous-convenience-store/chapter-1': 0,
  'the-dangerous-convenience-store/chapter-2': 0,
  'the-dangerous-convenience-store/chapter-3': 0,
};

export function generateStaticParams() {
  return manhwaList.flatMap((item) =>
    item.chapters.map((chapter) => ({
      slug: item.slug,
      chapter: chapter.slug,
    }))
  );
}

export default function ReaderPage({ params }: Props) {
  const manhwa = getManhwa(params.slug);

  if (!manhwa) notFound();

  const chapterIndex = manhwa.chapters.findIndex(
    (chapter) => chapter.slug === params.chapter
  );

  if (chapterIndex === -1) notFound();

  const chapter = manhwa.chapters[chapterIndex];
  const previous = manhwa.chapters[chapterIndex - 1];
  const next = manhwa.chapters[chapterIndex + 1];

  const pageCount =
    chapterPageCounts[`${params.slug}/${params.chapter}`] ?? 0;

  return (
    <ReaderViewer
      title={manhwa.title}
      chapterTitle={chapter.title}
      slug={manhwa.slug}
      chapterSlug={chapter.slug}
      previous={previous?.slug}
      next={next?.slug}
      pageCount={pageCount}
    />
  );
}
