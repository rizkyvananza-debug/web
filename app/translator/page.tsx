
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const OWNER_EMAIL = "lukiiedavies@gmail.com";

type Series = {
  id: string;
  title: string;
  slug: string;
  status: string;
  chapter_count: number;
};

type Chapter = {
  id: string;
  series_id: string;
  chapter_number: number;
  title: string | null;
  is_published: boolean;
};

export default function TranslatorPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [series, setSeries] = useState<Series[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [publishing, setPublishing] = useState("");
  const [tab, setTab] = useState<"series" | "chapter">("series");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genres, setGenres] = useState("");
  const [author, setAuthor] = useState("");
  const [artist, setArtist] = useState("");
  const [publisher, setPublisher] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [cover, setCover] = useState<File | null>(null);

  const [selectedSeries, setSelectedSeries] = useState("");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterImages, setChapterImages] = useState<File[]>([]);
  const [pdfPages, setPdfPages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState("");

  useEffect(() => {
    void checkOwner();
  }, []);

  async function checkOwner() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      router.replace("/login");
      return;
    }

    if (data.user.email?.toLowerCase() !== OWNER_EMAIL) {
      await supabase.auth.signOut();
      router.replace("/login");
      return;
    }

    await Promise.all([loadSeries(), loadChapters()]);
    setChecking(false);
  }

  async function loadSeries() {
    const { data, error } = await supabase
      .from("manhwa_series")
      .select("id,title,slug,status,chapter_count")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Gagal mengambil daftar manhwa: " + error.message);
      return;
    }

    setSeries(data || []);
    if (data?.length && !selectedSeries) {
      setSelectedSeries(data[0].id);
    }
  }

  async function loadChapters() {
    const { data, error } = await supabase
      .from("manhwa_chapters")
      .select("id,series_id,chapter_number,title,is_published")
      .order("chapter_number", { ascending: false });

    if (error) {
      setMessage("Gagal mengambil daftar chapter: " + error.message);
      return;
    }

    setChapters(data || []);
  }

  async function uploadImage(file: File, folder: string) {
    const extension = file.name.split(".").pop() || "webp";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("manhwa-images")
      .upload(path, file, {
        upsert: false,
        contentType: file.type || "image/webp",
      });

    if (error) throw error;

    return supabase.storage.from("manhwa-images").getPublicUrl(path)
      .data.publicUrl;
  }

  function makeSlug(value: string) {
    return value.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function addSeries(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!cover) throw new Error("Pilih gambar cover terlebih dahulu.");

      const finalSlug = makeSlug(slug || title);
      if (!finalSlug) throw new Error("Slug tidak boleh kosong.");

      const coverUrl = await uploadImage(cover, "covers");

      const { error } = await supabase.from("manhwa_series").insert({
        title: title.trim(),
        slug: finalSlug,
        synopsis: synopsis.trim(),
        genres: genres.split(",").map((x) => x.trim()).filter(Boolean),
        author: author.trim(),
        artist: artist.trim(),
        publisher: publisher.trim(),
        status,
        cover_url: coverUrl,
        chapter_count: 0,
      });

      if (error) throw error;

      setMessage("Manhwa berhasil ditambahkan.");
      setTitle("");
      setSlug("");
      setSynopsis("");
      setGenres("");
      setAuthor("");
      setArtist("");
      setPublisher("");
      setCover(null);
      await loadSeries();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menambahkan manhwa.");
    } finally {
      setLoading(false);
    }
  }

  async function convertPdf(file: File) {
    if (file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")) {
      setMessage("File harus berformat PDF.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setMessage("Ukuran PDF maksimal 100 MB.");
      return;
    }

    setConverting(true);
    setPdfPages([]);
    setMessage("");

    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.10.38/legacy/build/pdf.worker.min.mjs";

      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
      }).promise;

      if (pdf.numPages > 300) {
        throw new Error("Maksimal 300 halaman per PDF.");
      }

      const converted: File[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setMessage(`Mengubah halaman ${i} dari ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) throw new Error("Browser tidak dapat membuat gambar.");

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({ canvasContext: context, viewport }).promise;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (result) => result
              ? resolve(result)
              : reject(new Error("Gagal mengubah halaman PDF.")),
            "image/webp",
            0.85
          );
        });

        converted.push(new File([blob], `page-${i}.webp`, {
          type: "image/webp",
        }));

        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }

      setPdfPages(converted);
      setMessage(`${converted.length} halaman PDF siap diunggah.`);
    } catch (error) {
      setPdfPages([]);
      setMessage(error instanceof Error ? error.message : "Gagal memproses PDF.");
    } finally {
      setConverting(false);
    }
  }

  async function addChapter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let chapterId = "";

    try {
      if (!selectedSeries) throw new Error("Pilih manhwa terlebih dahulu.");

      const urls = imageUrls.split("\n").map((x) => x.trim()).filter(Boolean);
      const files = [...pdfPages, ...chapterImages];

      if (!files.length && !urls.length) {
        throw new Error("Pilih PDF, gambar, atau masukkan URL gambar.");
      }

      if (urls.some((url) => !/^https?:\/\/\S+$/i.test(url))) {
        throw new Error("Ada URL gambar yang tidak valid.");
      }

      const number = Number(chapterNumber);
      if (!Number.isFinite(number) || number < 0) {
        throw new Error("Nomor chapter tidak valid.");
      }

      if (files.length + urls.length > 300) {
        throw new Error("Maksimal 300 halaman per chapter.");
      }

      const { data: chapter, error: chapterError } = await supabase
        .from("manhwa_chapters")
        .insert({
          series_id: selectedSeries,
          chapter_number: number,
          title: chapterTitle.trim(),
          is_published: false,
        })
        .select()
        .single();

      if (chapterError) throw chapterError;
      chapterId = chapter.id;

      for (let i = 0; i < files.length; i++) {
        setMessage(`Mengunggah halaman ${i + 1} dari ${files.length + urls.length}...`);
        const imageUrl = await uploadImage(files[i], `chapters/${chapter.id}`);

        const { error } = await supabase.from("manhwa_pages").insert({
          chapter_id: chapter.id,
          page_number: i + 1,
          image_url: imageUrl,
        });

        if (error) throw error;
      }

      for (let i = 0; i < urls.length; i++) {
        const { error } = await supabase.from("manhwa_pages").insert({
          chapter_id: chapter.id,
          page_number: files.length + i + 1,
          image_url: urls[i],
        });

        if (error) throw error;
      }

      setMessage(
        `Chapter berhasil disimpan sebagai Draft (${files.length + urls.length} halaman). Tekan Publish di daftar chapter untuk menerbitkannya.`
      );

      setChapterNumber(String(number + 1));
      setChapterTitle("");
      setChapterImages([]);
      setPdfPages([]);
      setImageUrls("");
      await loadChapters();
      await loadSeries();
    } catch (error) {
      setMessage(
        (error instanceof Error ? error.message : "Gagal menyimpan chapter.") +
        (chapterId ? " Chapter mungkin tersimpan sebagian; periksa daftar chapter." : "")
      );
      await loadChapters();
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(chapter: Chapter) {
    setPublishing(chapter.id);
    setMessage("");

    try {
      const nextStatus = !chapter.is_published;

      if (nextStatus) {
        const { count, error: pageError } = await supabase
          .from("manhwa_pages")
          .select("id", { count: "exact", head: true })
          .eq("chapter_id", chapter.id);

        if (pageError) throw pageError;
        if (!count) throw new Error("Chapter belum memiliki halaman.");
      }

      const { error } = await supabase
        .from("manhwa_chapters")
        .update({ is_published: nextStatus })
        .eq("id", chapter.id);

      if (error) throw error;

      const { count, error: countError } = await supabase
        .from("manhwa_chapters")
        .select("id", { count: "exact", head: true })
        .eq("series_id", chapter.series_id)
        .eq("is_published", true);

      if (countError) throw countError;

      const { error: updateError } = await supabase
        .from("manhwa_series")
        .update({ chapter_count: count || 0 })
        .eq("id", chapter.series_id);

      if (updateError) throw updateError;

      setMessage(nextStatus ? "Chapter berhasil di-Publish!" : "Chapter kembali menjadi Draft.");
      await Promise.all([loadChapters(), loadSeries()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengubah status chapter.");
    } finally {
      setPublishing("");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-[#100d10] text-white flex items-center justify-center">
        Memeriksa akun owner...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#100d10] text-[#f5e9e9] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[#ef91a5] tracking-[0.3em] text-xs">ANDREW STORE YAOI</p>
            <h1 className="text-3xl font-serif mt-2">Translator Studio</h1>
            <p className="text-sm text-[#b8a6ad] mt-2">Owner: {OWNER_EMAIL}</p>
          </div>
          <button onClick={logout} className="rounded-xl border border-[#67404d] px-4 py-2 text-sm">
            Logout
          </button>
        </header>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => { setTab("series"); setMessage(""); }}
            className={`rounded-xl py-3 font-semibold ${tab === "series" ? "bg-[#713c50] text-white" : "bg-[#25202a] text-[#b8a6ad]"}`}>
            + Add Manhwa
          </button>
          <button onClick={() => { setTab("chapter"); setMessage(""); }}
            className={`rounded-xl py-3 font-semibold ${tab === "chapter" ? "bg-[#713c50] text-white" : "bg-[#25202a] text-[#b8a6ad]"}`}>
            + Add Chapter
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-[#765260] bg-[#291b24] p-4 text-sm text-[#f5b6c2]">
            {message}
          </div>
        )}

        {tab === "series" && (
          <form onSubmit={addSeries} className="space-y-5 rounded-2xl border border-[#49323b] bg-[#191318] p-5">
            <h2 className="text-xl font-serif">Add New Manhwa</h2>

            <label className="block">Judul Manhwa *
              <input required value={title} onChange={(e) => {
                setTitle(e.target.value);
                if (!slug) setSlug(makeSlug(e.target.value));
              }} placeholder="No More Eurydice" className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <label className="block">Slug URL
              <input value={slug} onChange={(e) => setSlug(makeSlug(e.target.value))} placeholder="no-more-eurydice" className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <label className="block">Sinopsis
              <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <label className="block">Genre (pisahkan dengan koma)
              <input value={genres} onChange={(e) => setGenres(e.target.value)} placeholder="Drama, Romance, Fantasy" className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <label className="block">Author
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <label className="block">Artist
              <input value={artist} onChange={(e) => setArtist(e.target.value)} className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <label className="block">Publisher
              <input value={publisher} onChange={(e) => setPublisher(e.target.value)} className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <label className="block">Status
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3">
                <option value="ongoing">Ongoing</option>
                <option value="hiatus">Hiatus</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label className="block">Cover Manhwa *
              <input required type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} className="mt-2 w-full text-sm" />
            </label>

            <button disabled={loading} className="w-full rounded-xl bg-[#ef91a5] py-3 font-bold text-[#321622] disabled:opacity-50">
              {loading ? "Menyimpan..." : "Simpan Manhwa"}
            </button>
          </form>
        )}

        {tab === "chapter" && (
          <form onSubmit={addChapter} className="space-y-5 rounded-2xl border border-[#49323b] bg-[#191318] p-5">
            <h2 className="text-xl font-serif">Upload Chapter</h2>

            <label className="block">Pilih Manhwa *
              <select required value={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value)} className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3">
                <option value="">Pilih manhwa...</option>
                {series.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
            </label>

            <label className="block">Nomor Chapter *
              <input required type="number" min="0" step="0.1" value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <label className="block">Judul Chapter
              <input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} placeholder="Chapter 1" className="mt-2 w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3" />
            </label>

            <div className="rounded-xl border border-[#67404d] p-4 space-y-3">
              <h3 className="font-semibold text-[#ef91a5]">1. Upload PDF</h3>
              <input type="file" accept="application/pdf,.pdf" disabled={converting || loading} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void convertPdf(file);
                e.currentTarget.value = "";
              }} className="w-full text-sm" />
              <p className="text-xs text-[#a999a2]">PDF akan diubah menjadi gambar WebP.</p>
              {converting && <p className="text-sm text-[#ef91a5]">Sedang mengubah PDF...</p>}
              {pdfPages.length > 0 && <p className="text-sm text-[#c99b79]">{pdfPages.length} halaman PDF siap.</p>}
            </div>

            <div className="rounded-xl border border-[#67404d] p-4 space-y-3">
              <h3 className="font-semibold text-[#ef91a5]">2. Upload Gambar</h3>
              <input type="file" accept="image/*" multiple disabled={loading || converting} onChange={(e) => setChapterImages(Array.from(e.target.files || []))} className="w-full text-sm" />
              <p className="text-xs text-[#a999a2]">{chapterImages.length} gambar dipilih.</p>
            </div>

            <div className="rounded-xl border border-[#67404d] p-4 space-y-3">
              <h3 className="font-semibold text-[#ef91a5]">3. URL Gambar</h3>
              <textarea value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} rows={5} placeholder={"https://contoh.com/page-1.jpg\nhttps://contoh.com/page-2.jpg"} className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3 text-sm" />
              <p className="text-xs text-[#a999a2]">Satu URL gambar per baris.</p>
            </div>

            <div className="rounded-xl bg-[#251b23] p-4">
              <h3 className="font-semibold mb-2">Ringkasan Halaman</h3>
              <p className="text-sm text-[#b8a6ad]">PDF: {pdfPages.length}</p>
              <p className="text-sm text-[#b8a6ad]">Gambar: {chapterImages.length}</p>
              <p className="text-sm text-[#b8a6ad]">URL: {imageUrls.split("\n").filter((x) => x.trim()).length}</p>
              <p className="font-bold text-[#ef91a5] mt-2">Total: {pdfPages.length + chapterImages.length + imageUrls.split("\n").filter((x) => x.trim()).length} halaman</p>
            </div>

            <button type="submit" disabled={loading || converting || series.length === 0} className="w-full rounded-xl bg-[#ef91a5] py-3 font-bold text-[#321622] disabled:opacity-50">
              {loading ? "Menyimpan Draft..." : converting ? "Mengubah PDF..." : "Simpan sebagai Draft"}
            </button>
            {series.length === 0 && <p className="text-sm text-[#e5b6a7]">Tambahkan manhwa terlebih dahulu.</p>}
          </form>
        )}

        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif">My Series</h2>
            <button onClick={() => { void loadSeries(); void loadChapters(); }} className="text-sm text-[#ef91a5]">Refresh</button>
          </div>

          {series.map((item) => (
            <div key={item.id} className="mb-3 rounded-xl border border-[#49323b] bg-[#191318] p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-xs text-[#c99b79] mt-1">/{item.slug}</p>
              <p className="text-sm text-[#b8a6ad] mt-2">Status: {item.status} · {item.chapter_count} chapter Published</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif">Chapter Manager</h2>
            <button onClick={() => void loadChapters()} className="text-sm text-[#ef91a5]">Refresh</button>
          </div>

          {chapters.length === 0 ? (
            <p className="text-sm text-[#a999a2]">Belum ada chapter.</p>
          ) : (
            <div className="space-y-3">
              {chapters.map((chapter) => {
                const parent = series.find((item) => item.id === chapter.series_id);
                return (
                  <div key={chapter.id} className="rounded-xl border border-[#49323b] bg-[#191318] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{parent?.title || "Manhwa"} — Chapter {chapter.chapter_number}</p>
                        <p className="text-sm text-[#b8a6ad]">{chapter.title || "Tanpa judul"}</p>
                        <p className={`text-xs mt-2 ${chapter.is_published ? "text-green-400" : "text-amber-300"}`}>
                          {chapter.is_published ? "PUBLISHED" : "DRAFT"}
                        </p>
                      </div>
                      <button disabled={publishing === chapter.id} onClick={() => void togglePublish(chapter)}
                        className="rounded-lg bg-[#ef91a5] px-4 py-2 text-sm font-bold text-[#321622] disabled:opacity-50">
                        {publishing === chapter.id ? "Memproses..." : chapter.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
