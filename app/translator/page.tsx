
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
    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("manhwa-images")
      .upload(fileName, file, {
        upsert: false,
        contentType: file.type,
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
        genres: genres
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
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

  async function addChapter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!selectedSeries) {
        throw new Error("Pilih manhwa terlebih dahulu.");
      }

      if (chapterImages.length === 0) {
        throw new Error("Pilih gambar halaman chapter terlebih dahulu.");
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

      for (let i = 0; i < chapterImages.length; i++) {
        const imageUrl = await uploadImage(
          chapterImages[i],
          `chapters/${chapter.id}`
        );

        const { error: pageError } = await supabase
          .from("manhwa_pages")
          .insert({
            chapter_id: chapter.id,
            page_number: i + 1,
            image_url: imageUrl,
          });

        if (pageError) throw pageError;
      }

      const { data: existing } = await supabase
        .from("manhwa_chapters")
        .select("id")
        .eq("series_id", selectedSeries);

      const { error: countError } = await supabase
        .from("manhwa_series")
        .update({ chapter_count: existing?.length || 0 })
        .eq("id", selectedSeries);

      if (countError) throw countError;

      setMessage("Chapter berhasil ditambahkan!");
      setChapterNumber(String(number + 1));
      setChapterTitle("");
      setChapterImages([]);
      await loadSeries();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal menambahkan chapter."
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

            <div>
              <label className="block mb-2">Gambar Halaman Chapter *</label>
              <input
                required
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setChapterImages(Array.from(e.target.files || []))
                }
                className="w-full text-sm"
              />
              <p className="text-xs text-[#a999a2] mt-2">
                Pilih beberapa gambar sekaligus. Urutan file mengikuti urutan
                pilihan dari perangkatmu.
              </p>
              {chapterImages.length > 0 && (
                <p className="text-sm text-[#c99b79] mt-2">
                  {chapterImages.length} gambar dipilih.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || series.length === 0}
              className="w-full rounded-xl bg-[#ef91a5] py-3 font-bold text-[#321622] disabled:opacity-50"
            >
              {loading ? "Mengunggah..." : "Simpan Chapter"}
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
