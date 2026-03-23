'use client';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Home, Map, BookOpen, User as UserIcon, LogIn, UserPlus, Sun, Moon, Globe, Check } from 'lucide-react';
import { useThemeStore } from '@/lib/theme';
import { useLanguageStore } from '@/lib/language';
import { useCurrencyStore, CURRENCIES } from '@/lib/currency';
import { useTranslation } from '@/lib/i18n';

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, toggleLang } = useLanguageStore();
  const { currency, setCurrency } = useCurrencyStore();
  const { t } = useTranslation();
  
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  
  // Fermer le menu si on change de page
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const currentCurrency = CURRENCIES.find(c => c.code === currency);

  return (
    <nav style={{ 
      background: 'var(--white)', 
      borderBottom: '1px solid var(--border)', 
      height: 64, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 20px', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      boxShadow: '0 1px 12px rgba(0,0,0,0.06)' 
    }}>
      
      {/* LOGO */}
      <Link 
        href="/" 
        onClick={() => setIsOpen(false)}
        style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        Tourism<span style={{ color: 'var(--accent)' }}>BF</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* BOUTONS MOBILE QUICK TOOLS */}
        <div className="mobile-only" style={{ gap: 8, marginRight: 8, alignItems: 'center' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', padding: 4 }}>
                {mounted && theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
        </div>

        {/* BOUTON MENU MOBILE */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="mobile-only" 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 4 }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* LIENS DESKTOP */}
      <div className="desktop-only" style={{ alignItems: 'center', gap: 8 }}>
        <Link href="/" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray)', textDecoration: 'none' }}>{t('home')}</Link>
        <Link href="/destinations" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray)', textDecoration: 'none' }}>{t('destinations')}</Link>
        {mounted && isAuthenticated && (
          <Link href="/my-bookings" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray)', textDecoration: 'none' }}>{t('my_bookings')}</Link>
        )}

        {/* TOOLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 16, paddingLeft: 16, borderLeft: '1px solid var(--border)' }}>
            <button onClick={toggleLang} title="Changer de langue" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gray)', fontSize: '0.8rem', fontWeight: 700 }}>
                <Globe size={16} /> {lang}
            </button>

            <button onClick={toggleTheme} title="Changer de thème" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', display: 'flex', alignItems: 'center' }}>
                {mounted && theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button onClick={() => setIsCurrencyModalOpen(true)} title="Changer de devise" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.82rem', color: 'var(--dark)' }}>
                <span>{currentCurrency?.flag}</span>
                <span>{currency}</span>
            </button>
        </div>

        <div style={{ marginLeft: 8, display: 'flex', gap: 8 }}>
          {mounted && (
            isAuthenticated ? (
              <div
                onClick={() => router.push('/profile')}
                style={{ width: 38, height: 38, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', overflow: 'hidden', border: '2px solid var(--white)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
            ) : (
              <>
                <Link href="/login" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary)', border: '1.5px solid var(--primary)', textDecoration: 'none' }}>{t('login')}</Link>
                <Link href="/register" style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, color: 'white', background: 'var(--primary)', textDecoration: 'none' }}>{t('register')}</Link>
              </>
            )
          )}
        </div>
      </div>

      {/* MENU MOBILE (DROPOUT) */}
      {isOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, width: '100%', height: 'calc(100vh - 64px)', background: 'var(--white)', zIndex: 99, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, background: 'var(--light-gray)', color: 'var(--dark)', textDecoration: 'none', fontWeight: 600 }}><Home size={20} /> {t('home')}</Link>
          <Link href="/destinations" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, background: 'var(--light-gray)', color: 'var(--dark)', textDecoration: 'none', fontWeight: 600 }}><Map size={20} /> {t('destinations')}</Link>
          
          {mounted && isAuthenticated ? (
            <>
              <Link href="/my-bookings" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, background: 'var(--light-gray)', color: 'var(--dark)', textDecoration: 'none', fontWeight: 600 }}><BookOpen size={20} /> {t('my_bookings')}</Link>
              <Link href="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, background: 'rgba(26, 79, 214, 0.1)', color: '#1a4fd6', textDecoration: 'none', fontWeight: 600 }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={20} />
                )} 
                {t('profile')} ({user?.name})
              </Link>
            </>
          ) : (
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/login" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 12, border: '1.5px solid #1a4fd6', color: '#1a4fd6', textDecoration: 'none', fontWeight: 600 }}><LogIn size={20} /> {t('login')}</Link>
              <Link href="/register" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 12, background: '#1a4fd6', color: 'white', textDecoration: 'none', fontWeight: 600 }}><UserPlus size={20} /> {t('register')}</Link>
            </div>
          )}

          {/* MOBILE TOOLS */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={() => setIsCurrencyModalOpen(true)} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'var(--light-gray)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, color: 'var(--dark)' }}>
                {currentCurrency?.flag} {currency}
            </button>
            <button onClick={toggleLang} style={{ padding: 14, borderRadius: 12, background: 'var(--light-gray)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--dark)' }}>
                <Globe size={20} /> {lang}
            </button>
          </div>
        </div>
      )}

      {/* Currency Modal (Reused from Footer logic) */}
      {isCurrencyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--white)', borderRadius: 20, width: '90%', maxWidth: 450, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--dark)', fontFamily: 'var(--font-cormorant), serif' }}>{t('choose_currency')}</h3>
              <button onClick={() => setIsCurrencyModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: 'var(--gray)' }}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CURRENCIES.map((c) => (
                <div 
                  key={c.code}
                  onClick={() => { setCurrency(c.code); setIsCurrencyModalOpen(false); }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 14, cursor: 'pointer',
                    background: currency === c.code ? 'rgba(26, 79, 214, 0.08)' : 'transparent',
                    border: `2px solid ${currency === c.code ? '#1a4fd6' : 'var(--border)'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: 28 }}>{c.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>{c.code}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray)' }}>{c.label}</div>
                  </div>
                  {currency === c.code && <Check size={20} color="#1a4fd6" strokeWidth={3} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyframes for animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </nav>
  );
}