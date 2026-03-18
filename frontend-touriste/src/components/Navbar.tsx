'use client';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Home, Map, BookOpen, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  
  // Fermer le menu si on change de page
  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
      
      {/* LOGO */}
      <Link 
        href="/" 
        onClick={() => setIsOpen(false)}
        style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', fontWeight: 700, color: '#1a4fd6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        Tourism<span style={{ color: '#ff5722' }}>BF</span>
      </Link>

      {/* BOUTON MOBILE */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="mobile-only" 
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a4fd6' }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* LIENS DESKTOP */}
      <div className="desktop-only" style={{ alignItems: 'center', gap: 8 }}>
        <Link href="/" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none' }}>Accueil</Link>
        <Link href="/destinations" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none' }}>Destinations</Link>
        {mounted && isAuthenticated && (
          <Link href="/my-bookings" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none' }}>Mes réservations</Link>
        )}

        <div style={{ marginLeft: 8, display: 'flex', gap: 8 }}>
          {mounted && (
            isAuthenticated ? (
              <div
                onClick={() => router.push('/profile')}
                style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #1a4fd6, #ff5722)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', overflow: 'hidden' }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
            ) : (
              <>
                <Link href="/login" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: '#1a4fd6', border: '1.5px solid #1a4fd6', textDecoration: 'none' }}>Connexion</Link>
                <Link href="/register" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: 'white', background: '#1a4fd6', textDecoration: 'none' }}>S'inscrire</Link>
              </>
            )
          )}
        </div>
      </div>

      {/* MENU MOBILE (DROPOUT) */}
      {isOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, width: '100%', height: 'calc(100vh - 64px)', background: 'white', zIndex: 99, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, background: '#f4f6fa', color: '#0a0f1e', textDecoration: 'none', fontWeight: 600 }}><Home size={20} /> Accueil</Link>
          <Link href="/destinations" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, background: '#f4f6fa', color: '#0a0f1e', textDecoration: 'none', fontWeight: 600 }}><Map size={20} /> Destinations</Link>
          
          {mounted && isAuthenticated ? (
            <>
              <Link href="/my-bookings" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, background: '#f4f6fa', color: '#0a0f1e', textDecoration: 'none', fontWeight: 600 }}><BookOpen size={20} /> Mes réservations</Link>
              <Link href="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, background: '#eff6ff', color: '#1a4fd6', textDecoration: 'none', fontWeight: 600 }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={20} />
                )} 
                Mon Profil ({user?.name})
              </Link>
            </>
          ) : (
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/login" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 12, border: '1.5px solid #1a4fd6', color: '#1a4fd6', textDecoration: 'none', fontWeight: 600 }}><LogIn size={20} /> Connexion</Link>
              <Link href="/register" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 12, background: '#1a4fd6', color: 'white', textDecoration: 'none', fontWeight: 600 }}><UserPlus size={20} /> S'inscrire</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}