'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = 'Minimum 2 caractères';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 caractères';
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(res => setTimeout(res, 1000));
    login({ id: 'u1', name: form.name, email: form.email, role: 'TOURIST' }, 'mock-token');
    router.push('/');
    setLoading(false);
  };

  const fields = [
    { key: 'name', label: 'Nom complet', type: 'text', placeholder: 'Alimata Ouedraogo' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'alimata@email.com' },
    { key: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
    { key: 'confirm', label: 'Confirmer le mot de passe', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#f4f6fa' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <Link href="/" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', fontWeight: 700, color: '#1a4fd6', textDecoration: 'none', display: 'block', marginBottom: 32 }}>
          Tourism<span style={{ color: '#ff5722' }}>BF</span>
        </Link>

        <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 700, marginBottom: 6, color: '#0a0f1e' }}>Créer un compte</h2>
        <p style={{ color: '#6b7280', marginBottom: 32, fontSize: '0.9rem' }}>Rejoignez TourismBF gratuitement !</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6, color: '#0a0f1e' }}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', border: `1.5px solid ${errors[f.key] ? '#ef4444' : '#e5e7eb'}`, borderRadius: 10, padding: '11px 14px', fontSize: '0.92rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', background: 'white', boxSizing: 'border-box' }}
              />
              {errors[f.key] && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{errors[f.key]}</p>}
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            background: loading ? '#93c5fd' : '#1a4fd6', color: 'white', border: 'none',
            padding: '13px', borderRadius: 10, fontWeight: 600, fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-outfit), sans-serif',
            marginTop: 8
          }}>
            {loading ? 'Création...' : "Créer mon compte →"}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 20, fontSize: '0.88rem' }}>
          Déjà inscrit ?{' '}
          <Link href="/login" style={{ color: '#1a4fd6', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
