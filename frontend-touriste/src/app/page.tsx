'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DestinationCard from '@/components/DestinationCard';



const CATEGORIES = ['Tous', 'NATURE', 'CULTURE', 'AVENTURE', 'PLAGE'];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
 const [activecat, setActivecat] = useState('Tous');
const [destinations, setDestinations] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

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
        padding: '80px 40px', color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        {/* Pattern de fond */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div style={{ position: 'relative', maxWidth: 680 }}>
          {/* Tag */}
          <div style={{ display: 'inline-block', background: 'rgba(255,87,34,0.2)', color: '#ff8a65', border: '1px solid rgba(255,87,34,0.3)', padding: '6px 16px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600, marginBottom: 20, letterSpacing: '0.5px' }}>
            🌍 Plateforme Officielle de Tourisme
          </div>

          <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '3.8rem', fontWeight: 700, lineHeight: 1.15, marginBottom: 18 }}>
            Découvrez les merveilles du <em style={{ color: '#ff8a65', fontStyle: 'normal' }}>Burkina Faso</em>
          </h1>

          <p style={{ fontSize: '1.05rem', opacity: 0.8, lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
            Des destinations exceptionnelles, une culture unique et des expériences inoubliables vous attendent.
          </p>

          {/* Barre de recherche */}
          <div suppressHydrationWarning style={{ background: 'white', borderRadius: 14, padding: '8px 8px 8px 20px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 560, boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Rechercher une destination, une région..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: '#0a0f1e', fontFamily: 'var(--font-outfit), sans-serif', background: 'transparent' }}
            />
            <button onClick={handleSearch} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.92rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
              Rechercher
            </button>
          </div>

          {/* Filtres catégories */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActivecat(cat)} style={{
                background: activecat === cat ? '#ff5722' : 'rgba(255,255,255,0.1)',
                color: activecat === cat ? 'white' : 'rgba(255,255,255,0.85)',
                border: 'none', padding: '8px 20px', borderRadius: 25,
                fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif',
                transition: 'all 0.2s', backdropFilter: 'blur(5px)'
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Statistiques */}
          <div style={{ display: 'flex', gap: 40, marginTop: 40, paddingTop: 30, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[{ num: '50+', label: 'Destinations' }, { num: '2 000+', label: 'Voyageurs' }, { num: '4.8★', label: 'Note moyenne' }].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 700, color: 'white' }}>{s.num}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, color: 'white' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS POPULAIRES ===== */}
      <section style={{ padding: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem', fontWeight: 700, color: '#0a0f1e' }}>
            Destinations Populaires
          </h2>
          <button onClick={() => router.push('/destinations')} style={{ color: '#1a4fd6', fontSize: '0.88rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif' }}>
            Voir tout →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map(dest => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onClick={() => router.push(`/destinations/${dest.id}`)}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button onClick={() => router.push('/destinations')} style={{
            background: '#1a4fd6', color: 'white', border: 'none', padding: '15px 34px',
            borderRadius: 10, fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
            fontFamily: 'var(--font-outfit), sans-serif', transition: 'all 0.2s'
          }}>
            Voir toutes les destinations
          </button>
        </div>
      </section>
    </main>
  );
}
