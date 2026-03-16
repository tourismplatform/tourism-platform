"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import api from "@/lib/api";

export default function AdminProfilePage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({type: '', text: ''});
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [stats, setStats] = useState({ totalDestinations: 0, totalBookings: 0, totalUsers: 0, totalRevenue: 0 });

  useEffect(() => {
    if (!user) return;
    
    setForm(f => ({ 
      ...f, 
      name: user?.name || '', 
      phone: user?.phone || '' 
    }));
    setAvatarPreview(user?.avatar || null);
    
    // Charger les statistiques admin
    loadAdminStats();
  }, [user]);

  const loadAdminStats = async () => {
    try {
      const res = await adminAPI.getStats();
      if (res?.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setMessage({ type: 'error', text: 'Le nom est obligatoire' });
    if (form.newPassword && form.newPassword.length < 6)
      return setMessage({ type: 'error', text: 'Minimum 6 caractères pour le mot de passe' });
    if (form.newPassword && form.newPassword !== form.confirmPassword)
      return setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
    
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      
      const res = await authAPI.updateProfile(payload);
      updateUser && updateUser(res.data);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      setEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Seules les images sont autorisées' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Fichier trop volumineux. Maximum 5MB.' });
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await authAPI.uploadAvatar(formData);
      const newAvatarUrl = res.data.avatar;
      setAvatarPreview(newAvatarUrl);
      updateUser && updateUser({ ...user, avatar: newAvatarUrl });
      setMessage({ type: 'success', text: 'Avatar mis à jour avec succès !' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de l\'upload' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    window.location.href = "http://localhost:3000/login";
  };

  if (!user) return null;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>
          Mon Profil Administrateur
        </h1>
        <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      {/* Carte profil */}
      <div style={{ background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>

        {/* Avatar + infos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--blue-100)' }}
              />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue-600), var(--blue-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 24, border: '3px solid var(--blue-100)' }}>
                {initials}
              </div>
            )}
            <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--blue-600)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid white' }}>
              <span style={{ color: 'white', fontSize: 14 }}>📷</span>
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
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--gray-900)', marginBottom: 4 }}>{user?.name}</div>
            <div style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: 4 }}>{user?.email}</div>
            {user?.phone && (
              <div style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: 4 }}>📞 {user.phone}</div>
            )}
            <span style={{ background: 'var(--blue-100)', color: 'var(--blue-800)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              👑 Administrateur
            </span>
          </div>
          <button onClick={() => { setEditing(!editing); setMessage({type: '', text: ''}); }}
            style={{ background: editing ? 'var(--gray-100)' : 'var(--blue-600)', color: editing ? 'var(--gray-700)' : 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {editing ? 'Annuler' : '✏️ Modifier'}
          </button>
        </div>

        {/* Message feedback */}
        {message.text && (
          <div style={{ 
            background: message.type === 'success' ? '#d1fae5' : '#fef2f2', 
            color: message.type === 'success' ? '#065f46' : '#ef4444', 
            border: `1px solid ${message.type === 'success' ? '#6ee7b7' : '#fecaca'}`, 
            borderRadius: 8, 
            padding: '12px 16px', 
            marginBottom: 20, 
            fontSize: 14 
          }}>
            {message.text}
          </div>
        )}

        {/* Formulaire modification */}
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: 6 }}>Nom complet</label>
              <input 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: '100%', border: '1.5px solid var(--gray-300)', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: 6 }}>Téléphone</label>
              <input 
                value={form.phone} 
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+226 00 00 00 00"
                style={{ width: '100%', border: '1.5px solid var(--gray-300)', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: 12 }}>Changer le mot de passe (optionnel)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input 
                  type="password" 
                  placeholder="Mot de passe actuel" 
                  value={form.currentPassword} 
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-300)', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                />
                <input 
                  type="password" 
                  placeholder="Nouveau mot de passe" 
                  value={form.newPassword} 
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-300)', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                />
                <input 
                  type="password" 
                  placeholder="Confirmer le mot de passe" 
                  value={form.confirmPassword} 
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-300)', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>
            </div>
            <button 
              onClick={handleSave} 
              disabled={saving}
              style={{ background: saving ? 'var(--blue-400)' : 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Enregistrement...' : '💾 Sauvegarder'}
            </button>
          </div>
        ) : (
          <div>
            {[
              { label: 'Nom complet', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Téléphone', value: user?.phone || 'Non renseigné' },
              { label: 'Rôle', value: 'Administrateur' },
            ].map(item => (
              <div key={item.label} style={{ borderBottom: '1px solid var(--gray-200)', padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)' }}>{item.label}</span>
                <span style={{ fontSize: 14, color: 'var(--gray-900)', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistiques administrateur */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '🗺️', label: 'Destinations', value: stats.totalDestinations || 0 },
          { icon: '📅', label: 'Réservations', value: stats.totalBookings || 0 },
          { icon: '👥', label: 'Utilisateurs', value: stats.totalUsers || 0 },
          { icon: '💰', label: 'Revenus', value: (stats.totalRevenue || 0).toLocaleString() + ' F' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--gray-900)', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Déconnexion */}
      <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 12 }}>Session</h3>
        <button 
          onClick={handleLogout}
          style={{ width: '100%', background: 'transparent', border: '1.5px solid #ef4444', color: '#ef4444', borderRadius: 8, padding: '12px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
        >
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );
}
