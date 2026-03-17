'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import Link from 'next/link';
import api from '@/lib/api';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const redirectTo = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') || '/' : '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string; global?: string}>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: {email?: string; password?: string} = {};
    if (!email) e.email = 'Email obligatoire';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide';
    if (!password) e.password = 'Mot de passe obligatoire';
    else if (password.length < 6) e.password = 'Minimum 6 caractères';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data.data;
      
Cookies.set('token', token);
Cookies.set('user', JSON.stringify(user));
login(user, token);
if (user.role === 'ADMIN') {
 window.location.href = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3002/admin';
} else {
  router.push(redirectTo || '/');
}
    } catch (err: any) {
      setErrors({ global: err.response?.data?.message || 'Email ou mot de passe incorrect' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* PANNEAU GAUCHE */}
      <div style={{ display: 'none', width: '50%', background: 'linear-gradient(135deg, #0a0f1e, #1a4fd6)', alignItems: 'center', justifyContent: 'center', padding: 60, flexDirection: 'column', gap: 40 }} className="lg-flex">
        <div style={{ color: 'white', textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', fontWeight: 700, marginBottom: 40, color: '#ff5722' }}>TourismBF</div>
          <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2.8rem', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Explorez les merveilles du <span style={{ color: '#ff8a65' }}>Burkina Faso</span>
          </h2>
          <p style={{ opacity: 0.7, fontSize: '1rem', lineHeight: 1.7 }}>Des destinations uniques vous attendent.</p>
        </div>
      </div>

      {/* PANNEAU DROIT */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#f4f6fa' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', fontWeight: 700, color: '#1a4fd6', textDecoration: 'none', display: 'block', marginBottom: 32 }}>
            Tourism<span style={{ color: '#ff5722' }}>BF</span>
          </Link>

          <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 700, marginBottom: 6, color: '#0a0f1e' }}>Connexion</h2>
          <p style={{ color: '#6b7280', marginBottom: 32, fontSize: '0.9rem' }}>Bienvenue ! Entrez vos identifiants.</p>

          {errors.global && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#ef4444', fontSize: '0.88rem' }}>
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6, color: '#0a0f1e' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com"
                style={{ width: '100%', border: `1.5px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`, borderRadius: 10, padding: '11px 14px', fontSize: '0.92rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', background: 'white', boxSizing: 'border-box' }} />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6, color: '#0a0f1e' }}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                style={{ width: '100%', border: `1.5px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`, borderRadius: 10, padding: '11px 14px', fontSize: '0.92rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', background: 'white', boxSizing: 'border-box' }} />
              {errors.password && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? '#93c5fd' : '#1a4fd6', color: 'white', border: 'none',
              padding: '13px', borderRadius: 10, fontWeight: 600, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-outfit), sans-serif',
              marginTop: 8, transition: 'background 0.2s'
            }}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 20, fontSize: '0.88rem' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#1a4fd6', fontWeight: 600, textDecoration: 'none' }}>S'inscrire gratuitement</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
