'use client';
import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');
  return (
    <div style={{ background: 'var(--white)', borderRadius: 14, padding: '8px 8px 8px 20px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 560, boxShadow: '0 8px 40px rgba(0,0,0,0.3)', border: '1px solid var(--border)' }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch(query)}
        placeholder="Rechercher une destination..."
        style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--dark)', fontFamily: 'var(--font-outfit), sans-serif', background: 'transparent' }}
      />
      <button onClick={() => onSearch(query)} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.92rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
        Rechercher
      </button>
    </div>
  );
}
