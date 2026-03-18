'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Destination, Review } from '@/types';
import { useAuthStore } from '@/lib/auth';
import { useCurrencyStore } from '@/lib/currency';
import api from '@/lib/api';

const ICONS: Record<string, string> = { NATURE: '🌿', CULTURE: '🏛️', AVENTURE: '⛰️', PLAGE: '🏖️' };
const COLORS: Record<string, string> = {
  NATURE: 'linear-gradient(135deg, #00875a, #34d399)',
  CULTURE: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  AVENTURE: 'linear-gradient(135deg, #ff5722, #f59e0b)',
  PLAGE: 'linear-gradient(135deg, #1a4fd6, #06b6d4)',
};

export default function DestinationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { formatPrice } = useCurrencyStore();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { isAuthenticated } = useAuthStore();

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const after = new Date(); after.setDate(after.getDate() + 3);
  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(after.toISOString().split('T')[0]);
  const [persons, setPersons] = useState(1);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/destinations/${id}`)
      .then(res => {
        const data = res.data.data;
        setDestination(data);
        if (data.images && data.images.length > 0) {
          setSelectedImg(data.images[0]);
        }
      })
      .catch(() => setDestination(null));
    api.get(`/reviews/${id}`)
      .then(res => setReviews(res.data.data))
      .catch(() => setReviews([]));
  }, [id]);

  if (!destination) return <div style={{ textAlign: 'center', padding: 80 }}>Chargement...</div>;

  const nights = Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000));
  const total = (destination.price_per_person || 0) * persons * nights;
  const icon = ICONS[destination.category] || '📍';
  const color = COLORS[destination.category] || 'linear-gradient(135deg, #1a4fd6, #00875a)';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(16px, 5vw, 40px)' }}>

      {/* Fil d'ariane */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, fontSize: '0.85rem', color: '#6b7280', flexWrap: 'wrap' }}>
        <span onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>Accueil</span>
        <span>›</span>
        <span onClick={() => router.push('/destinations')} style={{ cursor: 'pointer' }}>Destinations</span>
        <span>›</span>
        <span style={{ color: '#0a0f1e', fontWeight: 600 }}>{destination.name}</span>
      </div>

      {/* LAYOUT */}
      <div style={{ display: 'flex', gap: 30, alignItems: 'start' }} className="flex-col lg:flex-row">

        {/* COLONNE GAUCHE (CONTENU) */}
        <div style={{ flex: 1, width: '100%' }}>
          {/* Galerie */}
          <div style={{ 
            borderRadius: 16, overflow: 'hidden', background: color, 
            height: 'clamp(250px, 40vh, 400px)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', fontSize: '5rem', 
            marginBottom: 12, position: 'relative' 
          }}>
            {selectedImg ? (
              <img src={selectedImg} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              icon
            )}
          </div>

          {/* Miniatures */}
          {destination.images && destination.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
              {destination.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImg(img)}
                  style={{ 
                    width: 80, height: 70, borderRadius: 8, cursor: 'pointer', 
                    border: selectedImg === img ? '2px solid #1a4fd6' : '2px solid transparent', 
                    flexShrink: 0, overflow: 'hidden', transition: 'all 0.2s', opacity: selectedImg === img ? 1 : 0.7
                  }}>
                  <img src={img} alt={`${destination.name} ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Infos */}
          <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 700, marginBottom: 10, color: '#0a0f1e' }}>
            {destination.name}
          </h1>
          <div style={{ display: 'flex', gap: 20, color: '#6b7280', fontSize: '0.85rem', marginBottom: 16, flexWrap: 'wrap' }}>
            <span>📍 {destination.location}</span>
            <span>🌿 {destination.category}</span>
            <span>⭐ {destination.avg_rating || 0}/5 ({reviews.length} avis)</span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {['Guidé', 'Transport inclus', 'Repas inclus', 'Hébergement'].map(tag => (
              <span key={tag} style={{ background: '#eff6ff', color: '#1a4fd6', padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: 'white', borderRadius: 14, padding: 24, marginBottom: 24, boxShadow: '0 4px 24px rgba(10,15,30,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 12 }}>Description</h2>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.8, color: '#374151' }}>{destination.description}</p>
          </div>

          {/* Avis */}
          <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 4px 24px rgba(10,15,30,0.08)', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>
              Avis des voyageurs ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Pas encore d'avis pour cette destination.</p>
            ) : reviews.map(review => (
              <div key={review.id} style={{ borderBottom: '1px solid #f4f6fa', paddingBottom: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{review.user?.name}</span>
                  <span style={{ color: '#d97706', fontSize: '0.85rem' }}>{'⭐'.repeat(review.rating)}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET RÉSERVATION */}
        <div style={{ 
          background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(10,15,30,0.12)', 
          padding: 24, width: '100%', maxWidth: 400,
          position: 'sticky', top: 84 
        }} className="lg:static-on-mobile">
          <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.9rem', fontWeight: 700, color: '#1a4fd6', marginBottom: 4 }}>
            {formatPrice(destination.price_per_person || 0)}{' '}
            <small style={{ fontSize: '0.9rem', color: '#6b7280', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 400 }}>/personne</small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, fontSize: '0.85rem' }}>
            <span style={{ color: '#d97706' }}>⭐ {destination.avg_rating || 0}</span>
            <span style={{ color: '#6b7280' }}>· {reviews.length} avis</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#0a0f1e', display: 'block', marginBottom: 6 }}>Arrivée</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#0a0f1e', display: 'block', marginBottom: 6 }}>Départ</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#0a0f1e', display: 'block', marginBottom: 6 }}>Personnes</label>
            <input type="number" value={persons} min={1} max={20} onChange={e => setPersons(Number(e.target.value))}
              style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ background: '#eff6ff', borderRadius: 10, padding: '14px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Total estimé</span>
            <span style={{ fontWeight: 700, color: '#1a4fd6', fontSize: '1.1rem' }}>{formatPrice(total)}</span>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                router.push(`/login?redirect=/destinations/${id}`);
                return;
              }
              router.push(`/booking?destination_id=${id}&check_in=${startDate}&check_out=${endDate}&nb_persons=${persons}&total_price=${total}`);
            }}
            style={{ width: '100%', background: '#ff5722', color: 'white', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
            Réserver maintenant
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#6b7280', marginTop: 12 }}>
            Confirmation immédiate après paiement
          </p>
        </div>
      </div>
    </div>
  );
}