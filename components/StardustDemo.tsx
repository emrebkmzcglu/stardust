
'use client';
import React, { useEffect, useMemo, useState } from "react";

/**
 * Stardust – Dark Theme + Enhanced Lucky Section
 * - Adds dark mode styling
 * - Adds headings: “Günün Şanslı Rengi” & “Günün Şanslı Sayısı”
 */

// Sign catalog
const SIGNS = [
  { key: "aries", name: { tr: "Koç", en: "Aries" }, emoji: "♈" },
  { key: "taurus", name: { tr: "Boğa", en: "Taurus" }, emoji: "♉" },
  { key: "gemini", name: { tr: "İkizler", en: "Gemini" }, emoji: "♊" },
  { key: "cancer", name: { tr: "Yengeç", en: "Cancer" }, emoji: "♋" },
  { key: "leo", name: { tr: "Aslan", en: "Leo" }, emoji: "♌" },
  { key: "virgo", name: { tr: "Başak", en: "Virgo" }, emoji: "♍" },
  { key: "libra", name: { tr: "Terazi", en: "Libra" }, emoji: "♎" },
  { key: "scorpio", name: { tr: "Akrep", en: "Scorpio" }, emoji: "♏" },
  { key: "sagittarius", name: { tr: "Yay", en: "Sagittarius" }, emoji: "♐" },
  { key: "capricorn", name: { tr: "Oğlak", en: "Capricorn" }, emoji: "♑" },
  { key: "aquarius", name: { tr: "Kova", en: "Aquarius" }, emoji: "♒" },
  { key: "pisces", name: { tr: "Balık", en: "Pisces" }, emoji: "♓" },
] as const;

// Simple seeded RNG
function seededIndex(seed: string, mod: number) {
  const n = [...seed].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381);
  return n % mod;
}

function generateReading(sign: string, lang: 'tr' | 'en', name?: string) {
  const day = new Date();
  const seed = `${day.toDateString()}:${sign}:${lang}`;
  const i = seededIndex(seed, 4);
  const you = name || (lang === 'tr' ? 'Bugün' : 'Today');

  const packs = {
    tr: {
      energy: [
        `${you} için güçlü bir enerji hissediliyor, sezgine güven.`,
        `Bugün sakin kalmak sana avantaj sağlar.`,
        `Planlarını netleştir, evren seninle iş birliği içinde.`,
        `Yeniliklere açık ol, şans senden yana olabilir.`
      ],
      love: [
        `Aşkta sürpriz bir mesaj alabilirsin, kalbini açık tut.`,
        `Birinin ilgisi seni şaşırtabilir.`,
        `Partnerinle derin bir konuşma yapma zamanı.`,
        `Sevgi, küçük jestlerde gizli.`
      ],
      career: [
        `Yeni bir fırsat kapıda, hazır ol.`,
        `Ekip içinde öne çıkıyorsun, liderliği üstlen.`,
        `Bir proje düşündüğünden daha fazla ilgi görebilir.`,
        `Dikkatini toplarsan bugünü verimli geçirirsin.`
      ],
      health: [
        `Bol su iç, bedenin enerjiye ihtiyaç duyuyor.`,
        `Kısa bir yürüyüş bile sana iyi gelir.`,
        `Ruh halin fiziksel durumunu etkileyebilir, pozitif kal.`,
        `Dinlenmekten suçluluk duymamalısın.`
      ],
      luckyColors: ["gece mavisi", "zümrüt yeşili", "bordo", "mor", "gümüş"],
      labels: {
        luckyColor: 'Günün Şanslı Rengi',
        luckyNumber: 'Günün Şanslı Sayısı',
      }
    },
    en: {
      energy: [
        `${you} radiates steady power; trust your instincts.`,
        `Calmness gives you an edge today.`,
        `Clarify your plans—the universe syncs with you.`,
        `Be open to surprises; luck may find you today.`
      ],
      love: [
        `A surprise message could brighten your heart.`,
        `Someone’s interest may take you by surprise.`,
        `A deep talk brings emotional clarity.`,
        `Love hides in small gestures.`
      ],
      career: [
        `A new opportunity knocks—be ready.`,
        `Your teamwork shines, take quiet leadership.`,
        `Your idea gains more traction than expected.`,
        `Stay focused and finish strong.`
      ],
      health: [
        `Hydrate well and move gently.`,
        `A short walk clears your thoughts.`,
        `Your mood affects your health—stay upbeat.`,
        `Rest is not laziness; it’s fuel.`
      ],
      luckyColors: ["midnight blue", "emerald", "burgundy", "violet", "silver"],
      labels: {
        luckyColor: "Today's Lucky Color",
        luckyNumber: "Today's Lucky Number",
      }
    }
  } as const;

  const pack = packs[lang];
  const pick = (arr: readonly string[]) => arr[i % arr.length];

  const luckyNumber = seededIndex(seed + ':n', 99) + 1;
  const luckyColor = pack.luckyColors[seededIndex(seed + ':c', pack.luckyColors.length)];

  return {
    energy: pick(pack.energy),
    love: pick(pack.love),
    career: pick(pack.career),
    health: pick(pack.health),
    luckyNumber,
    luckyColor,
    labels: pack.labels,
  };
}

export default function StardustDemo() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sign, setSign] = useState('aries');
  const [onboarding, setOnboarding] = useState(true);
  const [notifyLucky, setNotifyLucky] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('stardust_notify') === '1';
  });

  useEffect(() => {
    const saved = {
      name: localStorage.getItem('stardust_name') || '',
      age: localStorage.getItem('stardust_age') || '',
      sign: localStorage.getItem('stardust_sign') || 'aries',
      lang: (localStorage.getItem('stardust_lang') as 'tr' | 'en') || 'tr',
      notify: localStorage.getItem('stardust_notify') === '1'
    };
    setName(saved.name);
    setAge(saved.age);
    setSign(saved.sign);
    setLang(saved.lang);
    setNotifyLucky(saved.notify);
    setOnboarding(!(saved.name && saved.age));
  }, []);

  useEffect(() => {
    localStorage.setItem('stardust_name', name);
    localStorage.setItem('stardust_age', age);
    localStorage.setItem('stardust_sign', sign);
    localStorage.setItem('stardust_lang', lang);
    localStorage.setItem('stardust_notify', notifyLucky ? '1' : '0');
  }, [name, age, sign, lang, notifyLucky]);

  const reading = useMemo(() => generateReading(sign, lang, name), [sign, lang, name]);

  // Lucky hour (deterministic per day + sign)
  const luckyHour = useMemo(() => {
    const day = new Date();
    const key = `${day.getUTCFullYear()}-${day.getUTCMonth()+1}-${day.getUTCDate()}:${sign}:${lang}`;
    const hour = 7 + seededIndex(key + ':h', 13); // 07..19
    const half = seededIndex(key + ':m', 2) === 0 ? 0 : 30; // :00 or :30
    const label = `${String(hour).padStart(2,'0')}:${half===0?'00':'30'}`;
    return { hour, minute: half, label };
  }, [sign, lang]);

  // Schedule notification at lucky hour (today or tomorrow)
  useEffect(() => {
    if (!notifyLucky) return;
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;

    let timeoutId: number | undefined;

    const schedule = async () => {
      if (Notification.permission !== 'granted') {
        const p = await Notification.requestPermission();
        if (p !== 'granted') return;
      }
      const now = new Date();
      const target = new Date();
      target.setHours(luckyHour.hour, luckyHour.minute, 0, 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1); // schedule tomorrow
      }
      const ms = target.getTime() - now.getTime();
      timeoutId = window.setTimeout(() => {
        try {
          new Notification(lang==='tr' ? 'Şanslı saat!' : 'Lucky hour!', {
            body: lang==='tr'
              ? `${SIGNS.find(s=>s.key===sign)?.name.tr} için yorumuna göz at!`
              : `Check your ${SIGNS.find(s=>s.key===sign)?.name.en} reading!`
          });
        } catch {}
      }, ms);
    };

    schedule();
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [notifyLucky, luckyHour, lang, sign]);

  if (onboarding) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white grid place-items-center p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-semibold mb-1">Stardust</h1>
          <p className="text-sm text-gray-300 mb-6">{lang === 'tr' ? 'İsmini ve yaşını gir, yıldızlar seni tanısın.' : 'Enter your name and age to unlock your stars.'}</p>

          <label className="text-xs text-gray-400">{lang === 'tr' ? 'İsim' : 'Name'}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-600 bg-gray-900 text-white rounded-md w-full px-3 py-2 mb-3" />

          <label className="text-xs text-gray-400">{lang === 'tr' ? 'Yaş' : 'Age'}</label>
          <input value={age} onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))} className="border border-gray-600 bg-gray-900 text-white rounded-md w-full px-3 py-2 mb-4" />

          <button onClick={() => setOnboarding(false)} disabled={!name || !age} className={`w-full rounded-md px-3 py-2 text-white ${!name || !age ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>
            {lang === 'tr' ? 'Devam Et' : 'Continue'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">✨ Stardust</h1>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'tr' | 'en')}
            className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Sign Selector */}
        <div className="border border-gray-700 rounded-2xl p-6 bg-gray-800 mb-8">
          <p className="text-sm text-gray-400 mb-2">{lang === 'tr' ? 'Burcunu Seç' : 'Select your sign'}</p>
          <div className="flex flex-wrap gap-2">
            {SIGNS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSign(s.key)}
                className={`px-3 py-2 rounded-lg border ${s.key === sign ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
              >
                {s.emoji} {s.name[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-1">
            {lang === 'tr'
              ? `${SIGNS.find(s=>s.key===sign)?.name.tr} — Günlük Yorum`
              : `${SIGNS.find(s=>s.key===sign)?.name.en} — Daily Reading`}
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            {lang === 'tr' ? `Merhaba ${name}! Yaş: ${age}` : `Hi ${name}! Age: ${age}`}
          </p>

          <div className="space-y-4 text-[15px] leading-relaxed">
            <p>{reading.energy}</p>
            <p><strong>{lang==='tr'?'Aşk':'Love'}:</strong> {reading.love}</p>
            <p><strong>{lang==='tr'?'Kariyer':'Career'}:</strong> {reading.career}</p>
            <p><strong>{lang==='tr'?'Sağlık':'Health'}:</strong> {reading.health}</p>
          </div>

          {/* Lucky Section */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="border border-gray-700 rounded-xl p-4 bg-gray-900">
              <p className="text-xs text-gray-400">{lang==='tr'?'Günün Şanslı Rengi':"Today's Lucky Color"}</p>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className="inline-block w-5 h-5 rounded-full border border-gray-600"
                  style={{ background: String(reading.luckyColor) }}
                />
                <p className="text-lg font-semibold capitalize">{String(reading.luckyColor)}</p>
              </div>
            </div>

            <div className="border border-gray-700 rounded-xl p-4 bg-gray-900">
              <p className="text-xs text-gray-400">{lang==='tr'?'Günün Şanslı Sayısı':"Today's Lucky Number"}</p>
              <p className="text-lg font-semibold mt-2">{reading.luckyNumber}</p>
            </div>

            <div className="border border-gray-700 rounded-xl p-4 bg-gray-900">
              <p className="text-xs text-gray-400">{lang==='tr'?'Günün Şanslı Saati':"Today's Lucky Hour"}</p>
              <p className="text-lg font-semibold mt-2">{luckyHour.label}</p>
              <button
                onClick={() => setNotifyLucky(v=>!v)}
                className={`mt-3 w-full rounded-md px-3 py-2 border ${notifyLucky? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-800'}`}
              >
                {notifyLucky ? (lang==='tr'?'Bildirim açık':'Notifications on') : (lang==='tr'?'Şanslı saatte bildir':'Notify at lucky hour')}
              </button>
              {typeof window !== 'undefined' && !("Notification" in window) && (
                <p className="text-[12px] text-amber-400 mt-2">{lang==='tr'? 'Tarayıcın bildirim desteklemiyor.' : 'Your browser does not support notifications.'}</p>
              )}
            </div>
          </div>
        </div>
        {/* END content card */}
      </div>
    </div>
  );
}
