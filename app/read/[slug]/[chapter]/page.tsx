"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function DynamicReader(){
 const {slug,chapter}=useParams<{slug:string;chapter:string}>();
 const [series,setSeries]=useState<any>(null); const [chapterRow,setChapterRow]=useState<any>(null); const [pages,setPages]=useState<any[]>([]); const [chapters,setChapters]=useState<any[]>([]); const [busy,setBusy]=useState(true);
 useEffect(()=>{(async()=>{
  const {data:s}=await supabase.from("manhwa_series").select("id,title,slug").eq("slug",slug).single();
  if(s){setSeries(s);const {data:c}=await supabase.from("manhwa_chapters").select("*").eq("series_id",s.id).order("chapter_number");setChapters(c||[]);const current=(c||[]).find((x:any)=>x.id===chapter);if(current){setChapterRow(current);const {data:p}=await supabase.from("manhwa_pages").select("*").eq("chapter_id",current.id).order("page_number");setPages(p||[]);const key="asy-history";const old=JSON.parse(localStorage.getItem(key)||"[]");localStorage.setItem(key,JSON.stringify([{slug,title:s.title,chapterId:current.id,chapterTitle:current.title||`Chapter ${current.chapter_number}`,at:Date.now()},...old.filter((x:any)=>x.chapterId!==current.id)].slice(0,100)));}}
  setBusy(false);
 })();},[slug,chapter]);
 if(busy)return <main className="min-h-screen bg-[#100d10] text-white p-8">Loading reader...</main>;
 if(!series||!chapterRow)return <main className="min-h-screen bg-[#100d10] text-white p-8">Chapter tidak ditemukan. <Link href="/list">Kembali</Link></main>;
 const idx=chapters.findIndex((x:any)=>x.id===chapterRow.id);
 return <main className="min-h-screen bg-[#100d10] text-[#f5e9e9]">
 <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#191318] border-b border-[#49323b] p-4"><Link href={`/list/${slug}`}>← Detail</Link><div className="text-center"><b>{series.title}</b><p className="text-xs text-[#ef91a5]">{chapterRow.title||`Chapter ${chapterRow.chapter_number}`}</p></div><Link href="/account">Saved</Link></header>
 <section className="max-w-3xl mx-auto">{pages.length?pages.map((p:any)=><img key={p.id} src={p.image_url} alt={`Page ${p.page_number}`} className="block w-full h-auto" loading={p.page_number<3?"eager":"lazy"}/>):<div className="p-12 text-center">Belum ada halaman untuk chapter ini.</div>}</section>
 <footer className="flex justify-between max-w-3xl mx-auto p-6"><Link className={idx<=0?"pointer-events-none opacity-30":""} href={idx>0?`/read/${slug}/${chapters[idx-1].id}`:`/list/${slug}`}>← Previous</Link><Link href={`/list/${slug}`}>Chapters</Link><Link className={idx===chapters.length-1?"pointer-events-none opacity-30":""} href={idx<chapters.length-1?`/read/${slug}/${chapters[idx+1].id}`:`/list/${slug}`}>Next →</Link></footer>
 </main>;
}
