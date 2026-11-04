"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import "../library.css";

export default function SeriesDetail(){
 const params=useParams<{slug:string}>(); const slug=params.slug;
 const [series,setSeries]=useState<any>(null); const [chapters,setChapters]=useState<any[]>([]); const [busy,setBusy]=useState(true); const [saved,setSaved]=useState(false);
 useEffect(()=>{(async()=>{
  const {data:s}=await supabase.from("manhwa_series").select("*").eq("slug",slug).single();
  if(s){setSeries(s); const {data:c}=await supabase.from("manhwa_chapters").select("id,chapter_number,title,created_at").eq("series_id",s.id).order("chapter_number",{ascending:true});setChapters(c||[]);}
  setBusy(false);
 })();},[slug]);
 function toggleBookmark(){const key="asy-bookmarks";const arr=JSON.parse(localStorage.getItem(key)||"[]");const exists=arr.some((x:any)=>x.slug===slug);const next=exists?arr.filter((x:any)=>x.slug!==slug):[...arr,{slug,title:series.title}];localStorage.setItem(key,JSON.stringify(next));setSaved(!exists);}
 useEffect(()=>{if(typeof window!=="undefined"){const arr=JSON.parse(localStorage.getItem("asy-bookmarks")||"[]");setSaved(arr.some((x:any)=>x.slug===slug));}},[slug]);
 if(busy)return <main className="library-page p-10 text-white">Loading...</main>;
 if(!series)return <main className="library-page p-10 text-white">Manhwa tidak ditemukan. <Link href="/list">Kembali</Link></main>;
 return <main className="library-page detail-page"><div className="library-shell">
 <header className="library-header"><Link href="/list" className="library-brand">N<span>✦</span>E <small>ANDREW STORE YAOI</small></Link><Link href="/account" className="back-home">MY LIBRARY</Link></header>
 <section className="detail-hero wine"><div className="detail-cover">{series.cover_url?<img src={series.cover_url} alt={series.title} className="w-full h-full object-cover"/>:<div className="cover-art"><span className="cover-title">{series.title}</span></div>}</div>
 <div className="detail-copy"><p className="eyebrow">A STORY FROM THE ARCHIVE</p><h1>{series.title}</h1><div className="detail-tags">{(series.genres||[]).map((g:string)=><span key={g}>{g}</span>)}</div><p className="detail-synopsis">{series.synopsis}</p><dl className="detail-facts"><div><dt>CREATOR</dt><dd>{series.author||"—"}</dd></div><div><dt>STATUS</dt><dd>{series.status}</dd></div><div><dt>CHAPTERS</dt><dd>{chapters.length}</dd></div></dl><button onClick={toggleBookmark} className="start-reading">{saved?"REMOVE BOOKMARK":"ADD BOOKMARK"} ✦</button></div></section>
 <section className="chapter-section"><div className="section-heading"><div><p className="eyebrow">THE READING ROOM</p><h2>Chapters ({chapters.length})</h2></div></div>
 <div className="chapter-list">{chapters.map((c,i)=><Link href={`/read/${slug}/${c.id}`} className="chapter-row" key={c.id}><span className="chapter-number">{String(i+1).padStart(2,"0")}</span><span className="chapter-name">{c.title||`Chapter ${c.chapter_number}`}</span><span className="chapter-date">READ CHAPTER</span><span className="chapter-arrow">↗</span></Link>)}</div></section>
 </div></main>;
}
