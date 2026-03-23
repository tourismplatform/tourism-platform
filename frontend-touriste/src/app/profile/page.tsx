'use client';
export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { useCurrencyStore } from '@/lib/currency';
import { useTranslation } from '@/lib/i18n';
import api from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, login, updateUser } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      updateUser({ ...user!, name: form.name, phone: form.phone });
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
      updateUser({ ...user!, avatar: newAvatarUrl });
      setMessage({ type: 'success', text: 'Avatar mis à jour avec succès !' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de l\'upload' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!mounted || !isAuthenticated) return null;

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ maxWidth: 700, margin: 'clamp(20px, 5vw, 40px) auto', padding: '0 clamp(16px, 4vw, 24px)' }}>
      {/* Petite infusion de CSS pour l'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 700, marginBottom: 32, color: 'var(--dark)' }}>
        {t('my_profile_title')}
      </h1>

      {/* Carte profil */}
      <div style={{ background: 'var(--white)', borderRadius: 16, padding: 'clamp(20px, 5vw, 32px)', boxShadow: '0 4px 24px rgba(10,15,30,0.08)', marginBottom: 20, border: '1px solid var(--border)' }}>

        {/* Avatar + infos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                onClick={() => setShowZoom(true)}
                style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', cursor: 'zoom-in', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{ width: 76, height: 76, background: 'linear-gradient(135deg, #1a4fd6, #ff5722)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.8rem' }}>
                {initials}
              </div>
            )}
            <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--primary)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid var(--white)' }}>
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
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--dark)' }}>{user?.name}</div>
            <div style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: 6 }}>{user?.email}</div>
            {user?.phone && (
              <div style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: 6 }}>📞 {user.phone}</div>
            )}
            <span style={{ background: 'rgba(26, 79, 214, 0.1)', color: 'var(--primary)', padding: '2px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
              {user?.role === 'ADMIN' ? t('admin_role') : t('tourist_role')}
            </span>
          </div>
          <button onClick={() => { setEditing(!editing); setMessage(null); }}
            style={{ background: editing ? 'var(--light-gray)' : 'var(--primary)', color: editing ? 'var(--gray)' : 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', width: '100%', maxWidth: 'none', flex: '1 1 auto' }} className="md:w-auto">
            {editing ? t('cancel') : t('edit_profile')}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--gray)', marginBottom: 6 }}>Nom complet</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: '100%', border: '1.5px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', borderRadius: 10, padding: '12px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--gray)', marginBottom: 6 }}>Téléphone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+226 00 00 00 00"
                style={{ width: '100%', border: '1.5px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', borderRadius: 10, padding: '12px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--gray)', marginBottom: 16 }}>{t('security_title')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="password" placeholder={t('current_password')} value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', borderRadius: 10, padding: '12px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                <input type="password" placeholder={t('new_password')} value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', borderRadius: 10, padding: '12px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                <input type="password" placeholder={t('confirm_password')} value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', borderRadius: 10, padding: '12px 14px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              style={{ background: saving ? 'var(--gray)' : 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 600, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 8 }}>
              {saving ? t('saving_changes') : t('save_changes')}
            </button>
          </div>
        ) : (
          <div>
            {[
              { label: t('full_name'), value: user?.name },
              { label: t('email_label'), value: user?.email },
              { label: t('phone_label'), value: user?.phone || t('not_provided') },
              { label: t('role_label'), value: user?.role === 'ADMIN' ? t('admin_role') : t('tourist_role') },
            ].map(item => (
              <div key={item.label} style={{ borderBottom: '1px solid var(--border)', padding: '14px 0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--gray)' }}>{item.label}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--dark)', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: 12, 
        marginBottom: 24 
      }}>
        {[
          { icon: '📅', label: t('stats_bookings'), value: stats.total },
          { icon: '✅', label: t('stats_confirmed'), value: stats.confirmed },
          { icon: '🏁', label: t('stats_completed'), value: stats.completed },
          { icon: '💰', label: t('stats_spent'), value: formatPrice(stats.spent) },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--white)', borderRadius: 12, padding: '20px 12px', boxShadow: '0 4px 24px rgba(10,15,30,0.06)', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Déconnexion */}
      <button onClick={() => { logout(); router.push('/'); }}
        style={{ width: '100%', background: 'var(--white)', border: '1.5px solid #ef4444', color: '#ef4444', borderRadius: 10, padding: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.92rem' }}>
        {t('logout_btn')}
      </button>

      {/* Modal Zoom Image */}
      {showZoom && avatarPreview && (
        <div 
          onClick={() => setShowZoom(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out' }}
        >
          <img 
            src={avatarPreview} 
            alt="Zoom Avatar" 
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 20, boxShadow: '0 0 40px rgba(0,0,0,0.5)', border: '4px solid var(--white)' }} 
          />
          <button style={{ position: 'absolute', top: 20, right: 20, background: 'var(--white)', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', color: 'var(--dark)' }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}