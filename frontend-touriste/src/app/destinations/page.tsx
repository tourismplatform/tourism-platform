export const dynamic = 'force-dynamic';

'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Destination } from '@/types';
import DestinationCard from '@/components/DestinationCard';
import api from '@/lib/api';

const CATEGORIES = ['NATURE', 'CULTURE', 'AVENTURE', 'PLAGE'];

export default function DestinationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filtered, setFiltered] = useState<Destination[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [search] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);

  // Charger les destinations depuis l'API
  useEffect(() => {
    api.get('/destinations')
      .then(res => {
        setDestinations(res.data.data);
        setFiltered(res.data.data);
      })
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  // Filtrer les destinations
  useEffect(() => {
    let result = [...destinations];
    if (cats.length > 0) result = result.filter(d => cats.includes(d.category));
    if (search) result = result.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
    );
    result = result.filter(d =>
      (d.price_per_person || 0) <= maxPrice &&
      (d.avg_rating || 0) >= minRating
    );
    if (sort === 'price_asc') result.sort((a, b) => (a.price_per_person || 0) - (b.price_per_person || 0));
    else if (sort === 'price_desc') result.sort((a, b) => (b.price_per_person || 0) - (a.price_per_person || 0));
    else if (sort === 'rating') result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    setFiltered(result);
  }, [cats, maxPrice, minRating, search, sort, destinations]);

  const toggleCat = (cat: string) => {
    setCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>Chargement...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 64px)' }}>
      {/* SIDEBAR FILTRES */}
      <aside style={{ background: 'white', borderRight: '1px solid #e5e7eb', padding: 24, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <h3 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 24, color: '#0a0f1e' }}>Filtres</h3>

        {/* Catégories */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#6b7280', marginBottom: 12 }}>Catégorie</div>
          {CATEGORIES.map(cat => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', cursor: 'pointer', fontSize: '0.88rem', color: '#0a0f1e' }}>
              <input type="checkbox" checked={cats.includes(cat)} onChange={() => toggleCat(cat)} style={{ accentColor: '#1a4fd6', width: 15, height: 15 }} />
              {cat}
            </label>
          ))}
        </div>

        {/* Prix max */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#6b7280', marginBottom: 12 }}>Prix maximum</div>
          <input type="range" min={5000} max={100000} step={1000} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#1a4fd6' }} />
          <div style={{ background: '#f4f6fa', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', color: '#6b7280', marginTop: 8 }}>
            Max : {maxPrice.toLocaleString()} FCFA
          </div>
        </div>

        {/* Note min */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#6b7280', marginBottom: 12 }}>Note minimale</div>
          {[0, 3, 4, 4.5].map(r => (
            <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', cursor: 'pointer', fontSize: '0.88rem' }}>
              <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} style={{ accentColor: '#1a4fd6' }} />
              {r === 0 ? 'Toutes les notes' : `${r}+ ⭐`}
            </label>
          ))}
        </div>

        <button onClick={() => { setCats([]); setMaxPrice(100000); setMinRating(0); }} style={{ width: '100%', background: 'transparent', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px', fontSize: '0.88rem', cursor: 'pointer', color: '#6b7280', fontFamily: 'var(--font-outfit), sans-serif' }}>
          Réinitialiser les filtres
        </button>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main style={{ padding: 24, background: '#f4f6fa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'white', padding: '12px 16px', borderRadius: 10 }}>
          <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            <strong style={{ color: '#0a0f1e' }}>{filtered.length}</strong> destination(s) trouvée(s)
          </span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: '1.5px solid #e5e7eb', padding: '7px 14px', borderRadius: 8, fontSize: '0.85rem', fontFamily: 'var(--font-outfit), sans-serif', color: '#0a0f1e', outline: 'none', cursor: 'pointer' }}>
            <option value="popular">Plus populaires</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="rating">Meilleures notes</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
            Aucune destination trouvée
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {filtered.map(dest => (
              <DestinationCard key={dest.id} destination={dest} onClick={() => router.push(`/destinations/${dest.id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}