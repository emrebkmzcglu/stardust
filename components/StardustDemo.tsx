'use client';
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Star, Sparkles, Bell, Copy } from "lucide-react";

const strings = {
  en: { title:"Stardust — Daily Horoscope", subtitle:"Personalized, friendly, and a little magical.", selectSign:"Select your sign", today:"Today's Horoscope", generate:"Generate", luckyColor:"Lucky color", luckyNumber:"Lucky number", mood:"Mood", love:"Love", career:"Career", health:"Health", language:"Language", reminders:"Daily reminder", upgrade:"Upgrade", paywallCopy:"Ad-free + weekly outlook + compatibility.", subscribe:"Start 1-day free trial", priceLine:"$2.99/week after trial", copy:"Copy", copied:"Copied!" },
  tr: { title:"Stardust — Günlük Burç Yorumu", subtitle:"Kişiselleştirilmiş, samimi ve biraz büyülü.", selectSign:"Burcunu seç", today:"Günün Yorumu", generate:"Oluştur", luckyColor:"Şanslı renk", luckyNumber:"Şanslı sayı", mood:"Mod", love:"Aşk", career:"Kariyer", health:"Sağlık", language:"Dil", reminders:"Günlük hatırlatma", upgrade:"Yükselt", paywallCopy:"Reklamsız + haftalık görünüm + uyumluluk.", subscribe:"1 gün ücretsiz dene", priceLine:"Deneme sonrası haftalık $2.99", copy:"Kopyala", copied:"Kopyalandı!" }
};
const SIGNS = [
  { key:"aries", name:{en:"Aries",tr:"Koç"}, emoji:"♈" }, { key:"taurus", name:{en:"Taurus",tr:"Boğa"}, emoji:"♉" },
  { key:"gemini", name:{en:"Gemini",tr:"İkizler"}, emoji:"♊" }, { key:"cancer", name:{en:"Cancer",tr:"Yengeç"}, emoji:"♋" },
  { key:"leo", name:{en:"Leo",tr:"Aslan"}, emoji:"♌" }, { key:"virgo", name:{en:"Virgo",tr:"Başak"}, emoji:"♍" },
  { key:"libra", name:{en:"Libra",tr:"Terazi"}, emoji:"♎" }, { key:"scorpio", name:{en:"Scorpio",tr:"Akrep"}, emoji:"♏" },
  { key:"sagittarius", name:{en:"Sagittarius",tr:"Yay"}, emoji:"♐" }, { key:"capricorn", name:{en:"Capricorn",tr:"Oğlak"}, emoji:"♑" },
  { key:"aquarius", name:{en:"Aquarius",tr:"Kova"}, emoji:"♒" }, { key:"pisces", name:{en:"Pisces",tr:"Balık"}, emoji:"♓" },
];

function mulberry32(a:number){return function(){let t=(a+=0x6d2b79f5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const fragments={ en:{ starters:["Your energy is aligning","A subtle shift opens a new lane","Keep your pace steady","Trust the quiet green lights","A small risk blossoms big"], middles:["— say yes to simple wins","; a brief text changes the tone",", organize your space for clarity",", step away from the noise for 20 minutes",", share credit and momentum builds"], endings:["— and your timing lands perfectly.","; patience today is leverage tomorrow.","; your intuition is your best filter.","; you are closer than you think.","; reduce friction, increase flow."], moods:["focused","curious","grounded","optimistic","playful"] },
  tr:{ starters:["Enerjin hizalanıyor","İnce bir değişim yeni bir yol açıyor","Temponu sabit tut","Sessiz yeşil ışıklara güven","Küçük bir risk büyük çiçek açar"], middles:["— basit zaferlere evet de","; kısa bir mesaj tonu değiştirir",", alanını düzenle zihin açılır",", gürültüden 20 dakika uzaklaş",", paylaşılan kredi ivme getirir"], endings:["— ve zamanlaman tam isabet olur.","; bugünkü sabır yarına kaldıraç olur.","; sezgin en iyi filtredir.","; sandığından daha yakınsın.","; sürtünmeyi azalt, akışı artır."], moods:["odaklı","meraklı","dengeli","iyimser","oyuncu"] } };

function generateReading(signKey:string, lang:"tr"|"en", date=new Date()){
  const dayStr=`${date.getUTCFullYear()}${String(date.getUTCMonth()+1).padStart(2,"0")}${String(date.getUTCDate()).padStart(2,"0")}`;
  const signIndex=SIGNS.findIndex(s=>s.key===signKey); const seed=Number(dayStr)+signIndex*1337; const rng=mulberry32(seed);
  const pack=fragments[lang]; const pick=(arr:string[])=>arr[Math.floor(rng()*arr.length)];
  const colors={en:["navy","emerald","amber","rose","violet","charcoal","cream"],tr:["lacivert","zümrüt","kehribar","gül","menekşe","kömür","krem"]};
  const text=`${pick(pack.starters)} ${pick(pack.middles)} ${pick(pack.endings)}`;
  const luckyNumber=Math.floor(rng()*88)+1; const luckyColor=colors[lang][Math.floor(rng()*colors[lang].length)];
  const bars=[Math.round(rng()*40+60),Math.round(rng()*40+60),Math.round(rng()*40+60)];
  return { text, luckyNumber, luckyColor, mood:pick(pack.moods), stats:{love:bars[0],career:bars[1],health:bars[2]} };
}

function ProgressBar({value}:{value:number}){return(<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-2 bg-black" style={{width:`${value}%`}}/></div>);}

export default function StardustDemo(){
  const [lang,setLang]=useState<"tr"|"en">("tr"); const t=strings[lang];
  useEffect(() => {
  try {
    const saved = localStorage.getItem("stardust_lang");
    if (saved === "tr" || saved === "en") setLang(saved);
  } catch {}
}, []);

useEffect(() => {
  try { localStorage.setItem("stardust_lang", lang); } catch {}
}, [lang]);
  const [sign,setSign]=useState("aquarius"); const [copied,setCopied]=useState(false);
  const reading=useMemo(()=>generateReading(sign,lang),[sign,lang]);
  const [name, setName] = useState("");
const [editingName, setEditingName] = useState(false);
  useEffect(()=>{if(!copied)return; const id=setTimeout(()=>setCopied(false),1000); return()=>clearTimeout(id);},[copied]);
  const copyText=async()=>{const composed=`${t.today}\n\n${reading.text}\n\n${t.luckyColor}: ${reading.luckyColor}\n${t.luckyNumber}: ${reading.luckyNumber}`; try{await navigator.clipboard.writeText(composed); setCopied(true);}catch{}};
useEffect(() => {
  try {
    const saved = localStorage.getItem("stardust_name");
    if (saved) setName(saved);
  } catch {}
}, []);
useEffect(() => {
  try { localStorage.setItem("stardust_name", name); } catch {}
}, [name]);
{editingName ? (
  <div className="mt-2 flex items-center gap-2">
    <input
      autoFocus
      value={name}
      onChange={(e)=>setName(e.target.value)}
      placeholder={lang==="tr"?"İsmin":"Your name"}
      className="border rounded-md px-2 py-1"
    />
    <button
      onClick={()=>setEditingName(false)}
      className="border rounded-md px-2 py-1 hover:bg-gray-100"
    >
      {lang==="tr"?"Kaydet":"Save"}
    </button>
  </div>
) : (
  <p className="text-sm text-gray-500 mt-1">
    {name
      ? (lang==="tr" ? `Merhaba ${name}!` : `Hi ${name}!`)
      : (
        <button
          onClick={()=>setEditingName(true)}
          className="underline decoration-dotted hover:no-underline"
        >
          {lang==="tr"?"İsmini ekle":"Add your name"}
        </button>
      )
    }
  </p>
)}
  return(<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3"><motion.div initial={{rotate:-20}} animate={{rotate:0}}><Sparkles className="w-6 h-6"/></motion.div>
          <div><h1 className="text-2xl sm:text-3xl font-semibold">{t.title}</h1><p className="text-sm text-gray-500">{t.subtitle}</p></div></div>
        <div className="flex items-center gap-2">
          <select value={lang} onChange={e=>setLang(e.target.value as "tr"|"en")} className="border rounded-md px-3 py-2"><option value="tr">Türkçe</option><option value="en">English</option></select>
        </div>
      </div>
      <div className="border rounded-2xl p-4 mb-6">
        <div className="text-lg font-medium mb-3 flex items-center gap-2"><Sun className="w-5 h-5"/> Burcunu seç</div>
        <div className="flex flex-wrap gap-2 mt-2">{SIGNS.map(s=>(
          <button key={s.key} onClick={()=>setSign(s.key)} className={`rounded-2xl px-3 py-2 border ${s.key===sign?"bg-black text-white border-black":"bg-white hover:bg-gray-100"}`}>
            <span className="mr-2">{s.emoji}</span>{s.name[lang]}
          </button>))}</div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border rounded-2xl p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div><div className="text-base font-semibold flex items-center gap-2"><Moon className="w-5 h-5"/> {t.today}</div></div>
            <div className="flex gap-2"><button onClick={copyText} className="border rounded-md px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100"><Copy className="w-4 h-4"/> {copied?t.copied:t.copy}</button></div>
          </div>
          <AnimatePresence mode="wait"><motion.p key={reading.text} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="text-base leading-relaxed">{reading.text}</motion.p></AnimatePresence>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div><p className="text-xs text-gray-500">Aşk</p><ProgressBar value={reading.stats.love}/></div>
            <div><p className="text-xs text-gray-500">Kariyer</p><ProgressBar value={reading.stats.career}/></div>
            <div><p className="text-xs text-gray-500">Sağlık</p><ProgressBar value={reading.stats.health}/></div>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="border-2 border-dashed rounded-xl p-3"><p className="text-xs text-gray-500">{t.luckyColor}</p><p className="text-lg font-semibold capitalize">{reading.luckyColor}</p></div>
            <div className="border-2 border-dashed rounded-xl p-3"><p className="text-xs text-gray-500">{t.luckyNumber}</p><p className="text-lg font-semibold">{reading.luckyNumber}</p></div>
            <div className="border-2 border-dashed rounded-xl p-3"><p className="text-xs text-gray-500">{t.mood}</p><p className="text-lg font-semibold capitalize">{reading.mood}</p></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border rounded-2xl p-5 bg-white"><div className="text-base font-semibold mb-1 flex items-center gap-2"><Bell className="w-4 h-4"/> Günlük hatırlatma</div><button className="w-full border rounded-md px-3 py-2 hover:bg-gray-100">Enable</button></div>
        </div>
      </div>
    </div>
  </div>);
}
