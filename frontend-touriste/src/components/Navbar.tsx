'use client';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
      
      {/* LOGO */}
      <Link href="/" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', fontWeight: 700, color: '#1a4fd6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
        Tourism<span style={{ color: '#ff5722' }}>BF</span>
      </Link>

      {/* LIENS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/destinations" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = '#1a4fd6'; (e.target as HTMLElement).style.background = '#f4f6fa'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = '#6b7280'; (e.target as HTMLElement).style.background = 'transparent'; }}>
          Destinations
        </Link>

        {mounted && (
          isAuthenticated ? (
            <>
              <Link href="/my-bookings" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none' }}>
                Mes réservations
              </Link>
              {/* AVATAR */}
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1a4fd6, #ff5722)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: '#6b7280', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: '#1a4fd6', border: '1.5px solid #1a4fd6', textDecoration: 'none', background: 'transparent' }}>
                Connexion
              </Link>
              <Link href="/register" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: 'white', background: '#1a4fd6', textDecoration: 'none' }}>
                S'inscrire
              </Link>
            </>
          )
        )}
      </div>
    </nav>
  );
}
