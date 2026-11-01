export type Manhwa = {
  slug: string;
  title: string;
  alternateTitle: string;
  author: string;
  status: string;
  year: string;
  genres: string[];
  synopsis: string;
  accent: 'wine' | 'green';
  chapters: { slug: string; title: string }[];
};

export const manhwaList: Manhwa[] = [
  {
    slug: 'no-more-eurydice',
    title: 'No More Eurydice',
    alternateTitle: '노 모어 에우리디케',
    author: 'Baek Daekal',
    status: 'Ongoing',
    year: '2020',
    genres: ['Boys’ Love', 'Drama', 'Psychological', 'Romance'],
    synopsis:
      'Han Garam enters a prestigious arts university to pursue classical music. There, he encounters Professor Kim Heejae, a celebrated pianist whose ambitions begin to cast a shadow over Garam’s passion. A psychological romance about devotion, ambition, and the cost of loving something too deeply.',
    accent: 'wine',
    chapters: [
      { slug: 'chapter-1', title: 'Chapter 1' },
      { slug: 'chapter-2', title: 'Chapter 2' },
      { slug: 'chapter-3', title: 'Chapter 3' },
    ],
  },
  {
    slug: 'the-dangerous-convenience-store',
    title: 'The Dangerous Convenience Store',
    alternateTitle: '위험한 편의점',
    author: '945',
    status: 'Completed',
    year: '2020',
    genres: ['Boys’ Love', 'Romance', 'Comedy'],
    synopsis:
      'College student Yeo Eui-joon works the graveyard shift at a convenience store frequented by intimidating customers. When the gangster Gunwoo steps in to protect him, their unexpected connection draws Eui-joon closer to a dangerous world—and to someone he never expected to fall for.',
    accent: 'green',
    chapters: [
      { slug: 'chapter-1', title: 'Chapter 1' },
      { slug: 'chapter-2', title: 'Chapter 2' },
      { slug: 'chapter-3', title: 'Chapter 3' },
    ],
  },
];

export function getManhwa(slug: string) {
  return manhwaList.find((item) => item.slug === slug);
}
