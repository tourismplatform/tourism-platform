'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DestinationCard from '@/components/DestinationCard';



const CATEGORIES = ['Tous', 'NATURE', 'CULTURE', 'AVENTURE', 'PLAGE'];

import { useTranslation } from '@/lib/i18n';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [search, setSearch] = useState('');
  const [activecat, setActivecat] = useState('Tous');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    { id: 'Tous', label: t('cat_all') },
    { id: 'NATURE', label: t('cat_nature') },
    { id: 'CULTURE', label: t('cat_culture') },
    { id: 'AVENTURE', label: t('cat_aventure') },
    { id: 'PLAGE', label: t('cat_plage') },
  ];

  useEffect(() => {
    api.get('/destinations')
      .then(res => setDestinations(res.data.data))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = destinations
    .filter((d: any) => activecat === 'Tous' || d.category === activecat)
    .slice(0, 3);

  const handleSearch = () => {
    if (search.trim()) router.push(`/destinations?search=${search}`);
    else router.push('/destinations');
  };

  return (
    <main>
      {/* ===== HERO ===== */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0f2e8a 50%, #1a4fd6 100%)',
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)', color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        {/* Pattern de fond */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          {/* Tag */}
          <div style={{ display: 'inline-block', background: 'rgba(255,87,34,0.2)', color: '#ff8a65', border: '1px solid rgba(255,87,34,0.3)', padding: '6px 16px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600, marginBottom: 20, letterSpacing: '0.5px' }}>
            🌍 {t('official_platform')}
          </div>

          <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2.2rem, 8vw, 3.8rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 18 }}>
            {t('hero_title')} <em style={{ color: '#ff8a65', fontStyle: 'normal' }}>{t('hero_country')}</em>
          </h1>

          <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', opacity: 0.8, lineHeight: 1.7, marginBottom: 32, maxWidth: 550 }}>
            {t('hero_subtitle')}
          </p>

          {/* Barre de recherche */}
          <div suppressHydrationWarning style={{ 
            background: 'var(--white)', borderRadius: 14, padding: '8px', display: 'flex', 
            flexWrap: 'wrap', alignItems: 'center', gap: 10, maxWidth: 600, 
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)', border: '1px solid var(--border)'
          }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={t('search_placeholder')}
              style={{ flex: 1, minWidth: 200, border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--dark)', fontFamily: 'var(--font-outfit), sans-serif', background: 'transparent', paddingLeft: 12 }}
            />
            <button onClick={handleSearch} style={{ 
              background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', 
              borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.92rem', 
              fontFamily: 'var(--font-outfit), sans-serif', width: '100%', maxWidth: 'none',
              flex: '1 1 auto'
            }} className="md:w-auto">
              {t('search_button')}
            </button>
          </div>

          {/* Filtres catégories */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActivecat(cat.id)} style={{
                background: activecat === cat.id ? '#ff5722' : 'rgba(255,255,255,0.1)',
                color: activecat === cat.id ? 'white' : 'rgba(255,255,255,0.85)',
                border: 'none', padding: '8px 20px', borderRadius: 25,
                fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif',
                transition: 'all 0.2s', backdropFilter: 'blur(5px)'
              }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Statistiques */}
          <div style={{ display: 'flex', gap: 'clamp(20px, 5vw, 40px)', marginTop: 40, paddingTop: 30, borderTop: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap' }}>
            {[
              { num: '50+', label: t('stat_destinations') }, 
              { num: '2 000+', label: t('stat_travelers') }, 
              { num: '4.8★', label: t('stat_avg_rating') }
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, color: 'white' }}>{s.num}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, color: 'white' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS POPULAIRES ===== */}
      <section style={{ padding: 'clamp(24px, 5vw, 40px)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 700, color: 'var(--dark)' }}>
            {t('popular_destinations_title')}
          </h2>
          <button onClick={() => router.push('/destinations')} style={{ color: '#1a4fd6', fontSize: '0.88rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif' }}>
            {t('see_all')} →
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', 
          gap: 24 
        }}>
          {filtered.map(dest => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onClick={() => router.push(`/destinations/${dest.id}`)}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => router.push('/destinations')} style={{
            background: '#1a4fd6', color: 'white', border: 'none', padding: '15px 34px',
            borderRadius: 10, fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
            fontFamily: 'var(--font-outfit), sans-serif', transition: 'all 0.2s',
            width: '100%', maxWidth: 300
          }}>
            {t('see_all_destinations')}
          </button>
        </div>
      </section>
    </main>
  );
}
