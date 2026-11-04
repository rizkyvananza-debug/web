
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

export default function TranslatorPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [series, setSeries] = useState<Series[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [tab, setTab] = useState<"series" | "chapter">("series");

  // Form manhwa
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genres, setGenres] = useState("");
  const [author, setAuthor] = useState("");
  const [artist, setArtist] = useState("");
  const [publisher, setPublisher] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [cover, setCover] = useState<File | null>(null);

  // Form chapter
  const [selectedSeries, setSelectedSeries] = useState("");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterImages, setChapterImages] = useState<File[]>([]);
  const [pdfPages, setPdfPages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState("");

  useEffect(() => {
    checkOwner();
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

    await loadSeries();
    setChecking(false);
  }

  async function loadSeries() {
    const { data, error } = await supabase
      .from("manhwa_series")
      .select("id, title, slug, status, chapter_count")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Gagal mengambil daftar manhwa: " + error.message);
      return;
    }

    setSeries(data || []);

    if (data && data.length > 0 && !selectedSeries) {
      setSelectedSeries(data[0].id);
    }
  }

  async function uploadImage(file: File, folder: string) {
    const extension = file.name.split(".").pop() || "webp";
    const fileName = `${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("manhwa-images")
      .upload(fileName, file, {
        upsert: false,
        contentType: file.type || "image/webp",
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("manhwa-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function addSeries(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!cover) {
        throw new Error("Pilih gambar cover terlebih dahulu.");
      }

      const finalSlug = makeSlug(slug || title);

      if (!finalSlug) {
        throw new Error("Slug manhwa tidak boleh kosong.");
      }

      const coverUrl = await uploadImage(cover, "covers");

      const { error } = await supabase.from("manhwa_series").insert({
        title: title.trim(),
        slug: finalSlug,
        synopsis: synopsis.trim(),
        genres: genres.split(",").map((item) => item.trim()).filter(Boolean),
        author: author.trim(),
        artist: artist.trim(),
        publisher: publisher.trim(),
        status,
        cover_url: coverUrl,
        chapter_count: 0,
      });

      if (error) throw error;

      setMessage("Manhwa berhasil ditambahkan!");
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
      setMessage(
        error instanceof Error ? error.message : "Gagal menambahkan manhwa."
      );
    } finally {
      setLoading(false);
    }
  }

  // Mengubah setiap halaman PDF menjadi file WebP
  async function convertPdf(file: File) {
    const MAX_PDF_SIZE = 100 * 1024 * 1024;

    if (!file.name.toLowerCase().endsWith(".pdf") &&
        file.type !== "application/pdf") {
      setMessage("File harus berformat PDF.");
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setMessage("PDF terlalu besar. Maksimal 100 MB.");
      return;
    }

    setConverting(true);
    setMessage("");

    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.10.38/legacy/build/pdf.worker.min.mjs";

      const buffer = await file.arrayBuffer();

      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(buffer),
      }).promise;

      if (pdf.numPages > 300) {
        throw new Error(
          "PDF memiliki lebih dari 300 halaman. Pisahkan PDF menjadi beberapa bagian."
        );
      }

      const converted: File[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        setMessage(`Mengubah PDF: halaman ${pageNumber} dari ${pdf.numPages}...`);

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Browser tidak dapat membuat gambar.");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (result) => {
              if (result) resolve(result);
              else reject(new Error("Gagal mengubah halaman menjadi WebP."));
            },
            "image/webp",
            0.85
          );
        });

        converted.push(
          new File([blob], `page-${pageNumber}.webp`, {
            type: "image/webp",
          })
        );

        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }

      setPdfPages(converted);
      setMessage(
        `Berhasil mengubah ${converted.length} halaman PDF menjadi WebP.`
      );
    } catch (error) {
      setPdfPages([]);
      setMessage(
        error instanceof Error
          ? "Gagal membaca PDF: " + error.message
          : "Gagal mengubah PDF."
      );
    } finally {
      setConverting(false);
    }
  }

  async function addChapter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!selectedSeries) {
        throw new Error("Pilih manhwa terlebih dahulu.");
      }

      const urls = imageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      const allFiles = [...pdfPages, ...chapterImages];

      if (allFiles.length === 0 && urls.length === 0) {
        throw new Error("Pilih PDF, gambar, atau masukkan URL gambar.");
      }

      if (urls.some((url) => !/^https?:\/\/\S+$/i.test(url))) {
        throw new Error("Ada URL gambar yang tidak valid.");
      }

      const totalPages = allFiles.length + urls.length;

      if (totalPages > 300) {
        throw new Error("Maksimal 300 halaman untuk satu chapter.");
      }

      const number = Number(chapterNumber);

      if (!Number.isFinite(number) || number < 0) {
        throw new Error("Nomor chapter tidak valid.");
      }

      const { data: chapter, error: chapterError } = await supabase
        .from("manhwa_chapters")
        .insert({
          series_id: selectedSeries,
          chapter_number: number,
          title: chapterTitle.trim(),
        })
        .select()
        .single();

      if (chapterError) throw chapterError;

      // Upload file WebP hasil PDF dan gambar biasa
      for (let i = 0; i < allFiles.length; i++) {
        setMessage(`Mengunggah halaman ${i + 1} dari ${totalPages}...`);

        const imageUrl = await uploadImage(
          allFiles[i],
          `chapters/${chapter.id}`
        );

        const { error } = await supabase.from("manhwa_pages").insert({
          chapter_id: chapter.id,
          page_number: i + 1,
          image_url: imageUrl,
        });

        if (error) throw error;
      }

      // Simpan URL gambar langsung ke database
      for (let i = 0; i < urls.length; i++) {
        setMessage(
          `Menyimpan URL halaman ${allFiles.length + i + 1} dari ${totalPages}...`
        );

        const { error } = await supabase.from("manhwa_pages").insert({
          chapter_id: chapter.id,
          page_number: allFiles.length + i + 1,
          image_url: urls[i],
        });

        if (error) throw error;
      }

      const { data: existing, error: countReadError } = await supabase
        .from("manhwa_chapters")
        .select("id")
        .eq("series_id", selectedSeries);

      if (countReadError) throw countReadError;

      const { error: countError } = await supabase
        .from("manhwa_series")
        .update({ chapter_count: existing?.length || 0 })
        .eq("id", selectedSeries);

      if (countError) throw countError;

      setMessage(`Chapter berhasil ditambahkan! Total ${totalPages} halaman.`);
      setChapterNumber(String(number + 1));
      setChapterTitle("");
      setChapterImages([]);
      setPdfPages([]);
      setImageUrls("");

      await loadSeries();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan chapter."
      );
    } finally {
      setLoading(false);
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
            <p className="text-[#ef91a5] tracking-[0.3em] text-xs">
              ANDREW STORE YAOI
            </p>
            <h1 className="text-3xl font-serif mt-2">Translator Studio</h1>
            <p className="text-sm text-[#b8a6ad] mt-2">
              Owner: {OWNER_EMAIL}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-[#67404d] px-4 py-2 text-sm"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => {
              setTab("series");
              setMessage("");
            }}
            className={`rounded-xl py-3 font-semibold ${
              tab === "series"
                ? "bg-[#713c50] text-white"
                : "bg-[#25202a] text-[#b8a6ad]"
            }`}
          >
            + Add Manhwa
          </button>

          <button
            onClick={() => {
              setTab("chapter");
              setMessage("");
            }}
            className={`rounded-xl py-3 font-semibold ${
              tab === "chapter"
                ? "bg-[#713c50] text-white"
                : "bg-[#25202a] text-[#b8a6ad]"
            }`}
          >
            + Add Chapter
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-[#765260] bg-[#291b24] p-4 text-sm text-[#f5b6c2]">
            {message}
          </div>
        )}

        {tab === "series" && (
          <form
            onSubmit={addSeries}
            className="space-y-5 rounded-2xl border border-[#49323b] bg-[#191318] p-5"
          >
            <h2 className="text-xl font-serif">Add New Manhwa</h2>

            <div>
              <label className="block mb-2">Judul Manhwa *</label>
              <input
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) setSlug(makeSlug(e.target.value));
                }}
                placeholder="Contoh: No More Eurydice"
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Slug URL</label>
              <input
                value={slug}
                onChange={(e) => setSlug(makeSlug(e.target.value))}
                placeholder="no-more-eurydice"
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Sinopsis</label>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                rows={5}
                placeholder="Tulis sinopsis manhwa..."
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Genre</label>
              <input
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Drama, Romance, Fantasy"
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
              <p className="text-xs text-[#a999a2] mt-1">
                Pisahkan setiap genre dengan koma.
              </p>
            </div>

            <div>
              <label className="block mb-2">Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Artist</label>
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Publisher</label>
              <input
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              >
                <option value="ongoing">Ongoing</option>
                <option value="hiatus">Hiatus</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Cover Manhwa *</label>
              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {cover && (
                <p className="text-xs text-[#c99b79] mt-2">
                  File dipilih: {cover.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#ef91a5] py-3 font-bold text-[#321622] disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Manhwa"}
            </button>
          </form>
        )}

        {tab === "chapter" && (
          <form
            onSubmit={addChapter}
            className="space-y-5 rounded-2xl border border-[#49323b] bg-[#191318] p-5"
          >
            <h2 className="text-xl font-serif">Upload Chapter</h2>

            <div>
              <label className="block mb-2">Pilih Manhwa *</label>
              <select
                required
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              >
                <option value="">Pilih manhwa...</option>
                {series.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Nomor Chapter *</label>
              <input
                required
                type="number"
                min="0"
                step="0.1"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Judul Chapter</label>
              <input
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Contoh: Chapter 1"
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3"
              />
            </div>

            <div className="rounded-xl border border-[#67404d] p-4 space-y-3">
              <h3 className="font-semibold text-[#ef91a5]">
                1. Upload PDF → WebP
              </h3>
              <input
                type="file"
                accept="application/pdf,.pdf"
                disabled={converting || loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) convertPdf(file);
                  e.currentTarget.value = "";
                }}
                className="w-full text-sm"
              />
              <p className="text-xs text-[#a999a2]">
                Setiap halaman PDF akan diubah menjadi gambar WebP.
              </p>
              {converting && (
                <p className="text-sm text-[#ef91a5]">
                  Sedang mengubah PDF, jangan tutup halaman ini...
                </p>
              )}
              {pdfPages.length > 0 && (
                <p className="text-sm text-[#c99b79]">
                  {pdfPages.length} halaman WebP siap diunggah.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-[#67404d] p-4 space-y-3">
              <h3 className="font-semibold text-[#ef91a5]">
                2. Upload Gambar
              </h3>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={loading || converting}
                onChange={(e) =>
                  setChapterImages(Array.from(e.target.files || []))
                }
                className="w-full text-sm"
              />
              <p className="text-xs text-[#a999a2]">
                Pilih beberapa gambar sekaligus. Gambar akan diletakkan
                setelah halaman PDF.
              </p>
              {chapterImages.length > 0 && (
                <p className="text-sm text-[#c99b79]">
                  {chapterImages.length} gambar dipilih.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-[#67404d] p-4 space-y-3">
              <h3 className="font-semibold text-[#ef91a5]">
                3. URL Gambar
              </h3>
              <textarea
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                rows={5}
                placeholder={"https://contoh.com/page-1.jpg\nhttps://contoh.com/page-2.jpg"}
                className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3 text-sm"
              />
              <p className="text-xs text-[#a999a2]">
                Satu URL gambar untuk setiap baris. URL akan diletakkan
                setelah file PDF dan gambar yang dipilih.
              </p>
              <p className="text-sm text-[#c99b79]">
                {imageUrls.split("\n").filter((url) => url.trim()).length}
                {" "}URL dimasukkan.
              </p>
            </div>

            <div className="rounded-xl bg-[#251b23] p-4">
              <h3 className="font-semibold mb-2">Ringkasan Halaman</h3>
              <p className="text-sm text-[#b8a6ad]">
                PDF: {pdfPages.length} halaman
              </p>
              <p className="text-sm text-[#b8a6ad]">
                Gambar: {chapterImages.length} file
              </p>
              <p className="text-sm text-[#b8a6ad]">
                URL: {imageUrls.split("\n").filter((url) => url.trim()).length}
              </p>
              <p className="font-bold text-[#ef91a5] mt-2">
                Total: {pdfPages.length + chapterImages.length +
                  imageUrls.split("\n").filter((url) => url.trim()).length} halaman
              </p>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                converting ||
                series.length === 0
              }
              className="w-full rounded-xl bg-[#ef91a5] py-3 font-bold text-[#321622] disabled:opacity-50"
            >
              {loading
                ? "Mengunggah..."
                : converting
                  ? "Mengubah PDF..."
                  : "Simpan Chapter"}
            </button>

            {series.length === 0 && (
              <p className="text-sm text-[#e5b6a7]">
                Tambahkan manhwa terlebih dahulu sebelum mengunggah chapter.
              </p>
            )}
          </form>
        )}

        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif">My Series</h2>
            <button
              onClick={loadSeries}
              className="text-sm text-[#ef91a5]"
            >
              Refresh
            </button>
          </div>

          {series.length === 0 ? (
            <p className="text-sm text-[#a999a2]">
              Belum ada manhwa. Tambahkan manhwa pertamamu!
            </p>
          ) : (
            <div className="space-y-3">
              {series.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#49323b] bg-[#191318] p-4"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-xs text-[#c99b79] mt-1">
                    /{item.slug}
                  </p>
                  <p className="text-sm text-[#b8a6ad] mt-2">
                    Status: {item.status} · {item.chapter_count} chapter
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
