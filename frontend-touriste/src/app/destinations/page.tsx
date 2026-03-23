'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Destination } from '@/types';
import DestinationCard from '@/components/DestinationCard';
import api from '@/lib/api';

const CATEGORIES = ['NATURE', 'CULTURE', 'AVENTURE', 'PLAGE'];

import { useCurrencyStore } from '@/lib/currency';

import { useTranslation } from '@/lib/i18n';

function DestinationsList() {
  const { formatPrice } = useCurrencyStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filtered, setFiltered] = useState<Destination[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [search] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);

  const CATEGORIES_TRANSLATED = [
    { id: 'NATURE', label: t('cat_nature') },
    { id: 'CULTURE', label: t('cat_culture') },
    { id: 'AVENTURE', label: t('cat_aventure') },
    { id: 'PLAGE', label: t('cat_plage') },
  ];

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

  const [showFilters, setShowFilters] = useState(false);

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--gray)' }}>{t('loading')}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', background: 'var(--light-gray)' }}>
      
      {/* BOUTON FILTRES MOBILE */}
      <div className="mobile-only" style={{ padding: '16px 20px', background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{ width: '100%', background: 'rgba(26, 79, 214, 0.08)', color: '#1a4fd6', border: '1.5px solid rgba(26, 79, 214, 0.2)', padding: '12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {showFilters ? `${t('close_filters')} ✕` : `${t('open_filters')} 🔍`}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }} className="flex-col md:flex-row">
        {/* SIDEBAR FILTRES */}
        <aside style={{ 
          background: 'var(--white)', borderRight: '1px solid var(--border)', padding: 24, 
          width: '100%', maxWidth: 280,
          position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto'
        }} className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <h3 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 24, color: 'var(--dark)' }}>{t('filter_title')}</h3>

          {/* Catégories */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray)', marginBottom: 12 }}>{t('category_label')}</div>
            {CATEGORIES_TRANSLATED.map(cat => (
              <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--dark)' }}>
                <input type="checkbox" checked={cats.includes(cat.id)} onChange={() => toggleCat(cat.id)} style={{ accentColor: '#1a4fd6', width: 15, height: 15 }} />
                {cat.label}
              </label>
            ))}
          </div>

          {/* Prix max */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray)', marginBottom: 12 }}>{t('max_price_label')}</div>
            <input type="range" min={5000} max={100000} step={1000} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#1a4fd6' }} />
            <div style={{ background: 'var(--light-gray)', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', color: 'var(--gray)', marginTop: 8 }}>
              Max : {formatPrice(maxPrice)}
            </div>
          </div>

          {/* Note min */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray)', marginBottom: 12 }}>{t('min_rating_label')}</div>
            {[0, 3, 4, 4.5].map(r => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--dark)' }}>
                <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} style={{ accentColor: '#1a4fd6' }} />
                {r === 0 ? t('all_ratings') : `${r}+ ⭐ ${t('rating_plus')}`}
              </label>
            ))}
          </div>

          <button onClick={() => { setCats([]); setMaxPrice(100000); setMinRating(0); }} style={{ width: '100%', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px', fontSize: '0.88rem', cursor: 'pointer', color: 'var(--gray)', fontFamily: 'var(--font-outfit), sans-serif' }}>
            {t('reset_filters')}
          </button>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main style={{ padding: 'clamp(16px, 4vw, 24px)', background: 'var(--light-gray)', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'var(--white)', padding: '12px 16px', borderRadius: 10, flexWrap: 'wrap', gap: 10, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
              <strong style={{ color: 'var(--dark)' }}>{filtered.length}</strong> {t('destinations_found')}
            </span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: '1.5px solid var(--border)', padding: '7px 14px', borderRadius: 8, fontSize: '0.85rem', fontFamily: 'var(--font-outfit), sans-serif', color: 'var(--dark)', background: 'var(--white)', outline: 'none', cursor: 'pointer' }}>
              <option value="popular">{t('sort_popular')}</option>
              <option value="price_asc">{t('sort_price_asc')}</option>
              <option value="price_desc">{t('sort_price_desc')}</option>
              <option value="rating">{t('sort_rating')}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
              {t('no_destinations_found')}
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', 
              gap: 20 
            }}>
              {filtered.map(dest => (
                <DestinationCard key={dest.id} destination={dest} onClick={() => router.push(`/destinations/${dest.id}`)} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function DestinationsPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 80, color: 'var(--gray)' }}>{t('loading')}</div>}>
      <DestinationsList />
    </Suspense>
  );
}