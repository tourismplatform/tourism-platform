'use client';
import { Destination } from '@/types';
import { useState } from 'react';

interface Props {
  destination: Destination;
  onClick: () => void;
}

const ICONS: Record<string, string> = {
  NATURE: '🌿',
  CULTURE: '🏛️',
  AVENTURE: '⛰️',
  PLAGE: '🏖️',
};

const COLORS: Record<string, string> = {
  NATURE: 'linear-gradient(135deg, #00875a, #34d399)',
  CULTURE: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  AVENTURE: 'linear-gradient(135deg, #ff5722, #f59e0b)',
  PLAGE: 'linear-gradient(135deg, #1a4fd6, #06b6d4)',
};

export default function DestinationCard({ destination, onClick }: Props) {
  const [fav, setFav] = useState(false);
  const icon = ICONS[destination.category] || '📍';
  const color = COLORS[destination.category] || 'linear-gradient(135deg, #1a4fd6, #00875a)';

  return (
    <div onClick={onClick} style={{
      background: 'white', borderRadius: 14, boxShadow: '0 4px 24px rgba(10,15,30,0.08)',
      overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(10,15,30,0.08)'; }}
    >
      {/* IMAGE / ICÔNE */}
      <div style={{ height: 200, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', position: 'relative' }}>
        {icon}
        {/* Badge catégorie */}
        <span style={{ position: 'absolute', top: 12, left: 12, background: '#ff5722', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.5px' }}>
          {destination.category}
        </span>
        {/* Bouton favori */}
        <button
          onClick={e => { e.stopPropagation(); setFav(!fav); }}
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {fav ? '❤️' : '🤍'}
        </button>
      </div>

      {/* INFOS */}
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4, color: '#0a0f1e' }}>
          {destination.name}
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: 10 }}>
          📍 {destination.location}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, color: '#1a4fd6', fontSize: '0.95rem' }}>
           {(destination.price || destination.price_per_person)?.toLocaleString()} FCFA<span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 400 }}>/pers.</span>
          </span>
          <span style={{ background: '#fff8e7', color: '#d97706', padding: '3px 8px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700 }}>
            ⭐  {destination.rating || destination.avg_rating || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
