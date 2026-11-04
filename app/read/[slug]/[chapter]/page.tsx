
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ReaderViewer from "./reader-viewer";

type Props = {
  params: {
    slug: string;
    chapter: string;
  };
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export default async function ReaderPage({ params }: Props) {
  const supabase = getSupabase();

  const { data: manhwa, error: manhwaError } = await supabase
    .from("manhwa_series")
    .select("id,title,slug")
    .eq("slug", params.slug)
    .single();

  if (manhwaError || !manhwa) notFound();

  const { data: chapter, error: chapterError } = await supabase
    .from("manhwa_chapters")
    .select("id,series_id,chapter_number,title,is_published")
    .eq("id", params.chapter)
    .eq("series_id", manhwa.id)
    .eq("is_published", true)
    .single();

  if (chapterError || !chapter) notFound();

  const { data: chapters, error: listError } = await supabase
    .from("manhwa_chapters")
    .select("id,chapter_number,title")
    .eq("series_id", manhwa.id)
    .eq("is_published", true)
    .order("chapter_number", { ascending: true });

  if (listError) {
    throw new Error("Gagal mengambil daftar chapter.");
  }

  const { data: pages, error: pagesError } = await supabase
    .from("manhwa_pages")
    .select("id,page_number,image_url")
    .eq("chapter_id", chapter.id)
    .order("page_number", { ascending: true });

  if (pagesError) {
    throw new Error("Gagal mengambil halaman chapter.");
  }

  const currentIndex = (chapters || []).findIndex(
    (item) => item.id === chapter.id
  );

  const previous = currentIndex > 0 ? chapters?.[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < (chapters?.length || 0) - 1
      ? chapters?.[currentIndex + 1]
      : null;

  return (
    <ReaderViewer
      title={manhwa.title}
      chapterTitle={chapter.title || `Chapter ${chapter.chapter_number}`}
      slug={manhwa.slug}
      chapterId={chapter.id}
      previous={previous?.id}
      next={next?.id}
      imageUrls={(pages || []).map((page) => page.image_url)}
    />
  );
}
