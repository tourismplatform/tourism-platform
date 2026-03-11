'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 700, marginBottom: 32, color: '#0a0f1e' }}>Mon Profil</h1>

      <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(10,15,30,0.08)', marginBottom: 20 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #1a4fd6, #ff5722)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.8rem' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0a0f1e' }}>{user?.name}</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{user?.email}</div>
            <div style={{ background: '#eff6ff', color: '#1a4fd6', padding: '2px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', marginTop: 4 }}>
              {user?.role}
            </div>
          </div>
        </div>

        {/* Infos */}
        {[
          { label: 'Nom complet', value: user?.name },
          { label: 'Email', value: user?.email },
          { label: 'Rôle', value: user?.role },
        ].map(item => (
          <div key={item.label} style={{ borderBottom: '1px solid #f4f6fa', padding: '14px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#6b7280' }}>{item.label}</span>
            <span style={{ fontSize: '0.9rem', color: '#0a0f1e', fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>

      <button onClick={() => { logout(); router.push('/'); }} style={{ width: '100%', background: 'transparent', border: '1.5px solid #ef4444', color: '#ef4444', borderRadius: 10, padding: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.92rem' }}>
        Se déconnecter
      </button>
    </div>
  );
}
