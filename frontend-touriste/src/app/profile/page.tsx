'use client';
export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import api from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, login } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setForm(f => ({ 
      ...f, 
      name: user?.name || '', 
      phone: user?.phone || '' 
    }));
    setAvatarPreview(user?.avatar || null);
    api.get('/bookings/my')
      .then(res => setBookings(res.data.data || []))
      .catch(() => setBookings([]));
  }, [isAuthenticated, user]);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    spent: bookings.filter(b => ['CONFIRMED','COMPLETED'].includes(b.status)).reduce((s, b) => s + (b.total_price || 0), 0),
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setMessage({ type: 'error', text: 'Le nom est obligatoire' });
    if (form.newPassword && form.newPassword.length < 6)
      return setMessage({ type: 'error', text: 'Minimum 6 caractères pour le mot de passe' });
    if (form.newPassword && form.newPassword !== form.confirmPassword)
      return setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
    setSaving(true);
    try {
      const payload: any = { name: form.name, phone: form.phone };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const res = await api.put('/auth/profile', payload);
      login({ ...user!, name: form.name, phone: form.phone }, '');
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      setEditing(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Seules les images sont autorisées' });
      return;
    }

    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Fichier trop volumineux. Maximum 5MB.' });
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newAvatarUrl = res.data.data.avatar;
      setAvatarPreview(newAvatarUrl);
      login({ ...user!, avatar: newAvatarUrl }, '');
      setMessage({ type: 'success', text: 'Avatar mis à jour avec succès !' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de l\'upload' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!isAuthenticated) return null;

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 700, marginBottom: 32, color: '#0a0f1e' }}>
        Mon Profil
      </h1>

      {/* Carte profil */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(10,15,30,0.08)', marginBottom: 20 }}>

        {/* Avatar + infos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: 76, height: 76, background: 'linear-gradient(135deg, #1a4fd6, #ff5722)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.8rem' }}>
                {initials}
              </div>
            )}
            <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: -2, right: -2, background: '#1a4fd6', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white' }}>
              <span style={{ color: 'white', fontSize: '12px' }}>📷</span>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
              style={{ display: 'none' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0a0f1e' }}>{user?.name}</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 6 }}>{user?.email}</div>
            {user?.phone && (
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 6 }}>📞 {user.phone}</div>
            )}
            <span style={{ background: '#eff6ff', color: '#1a4fd6', padding: '2px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
              {user?.role === 'ADMIN' ? '👑 Administrateur' : '🧭 Touriste'}
            </span>
          </div>
          <button onClick={() => { setEditing(!editing); setMessage(null); }}
            style={{ background: editing ? '#f4f6fa' : '#1a4fd6', color: editing ? '#6b7280' : 'white', border: 'none', borderRadius: 10, padding: '9px 18px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif' }}>
            {editing ? 'Annuler' : '✏️ Modifier'}
          </button>
        </div>

        {/* Message feedback */}
        {message && (
          <div style={{ background: message.type === 'success' ? '#d1fae5' : '#fef2f2', color: message.type === 'success' ? '#065f46' : '#ef4444', border: `1px solid ${message.type === 'success' ? '#6ee7b7' : '#fecaca'}`, borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: '0.88rem' }}>
            {message.text}
          </div>
        )}

        {/* Formulaire modification */}
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#6b7280', marginBottom: 6 }}>Nom complet</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#6b7280', marginBottom: 6 }}>Téléphone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+226 00 00 00 00"
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' }} />
            </div>
            <div style={{ borderTop: '1px solid #f4f6fa', paddingTop: 14 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#6b7280', marginBottom: 12 }}>Changer le mot de passe (optionnel)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="password" placeholder="Mot de passe actuel" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' }} />
                <input type="password" placeholder="Nouveau mot de passe" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' }} />
                <input type="password" placeholder="Confirmer le mot de passe" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' }} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              style={{ background: saving ? '#93c5fd' : '#1a4fd6', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 600, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-outfit), sans-serif' }}>
              {saving ? 'Enregistrement...' : '💾 Sauvegarder'}
            </button>
          </div>
        ) : (
          <div>
            {[
              { label: 'Nom complet', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Téléphone', value: user?.phone || 'Non renseigné' },
              { label: 'Rôle', value: user?.role },
            ].map(item => (
              <div key={item.label} style={{ borderBottom: '1px solid #f4f6fa', padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#6b7280' }}>{item.label}</span>
                <span style={{ fontSize: '0.9rem', color: '#0a0f1e', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: '📅', label: 'Réservations', value: stats.total },
          { icon: '✅', label: 'Confirmées', value: stats.confirmed },
          { icon: '🏁', label: 'Terminées', value: stats.completed },
          { icon: '💰', label: 'Total dépensé', value: stats.spent.toLocaleString() + ' F' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: '16px 12px', boxShadow: '0 4px 24px rgba(10,15,30,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0a0f1e', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Déconnexion */}
      <button onClick={() => { logout(); router.push('/'); }}
        style={{ width: '100%', background: 'transparent', border: '1.5px solid #ef4444', color: '#ef4444', borderRadius: 10, padding: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.92rem' }}>
        🚪 Se déconnecter
      </button>
    </div>
  );
}