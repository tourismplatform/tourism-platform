"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { adminAPI, authAPI } from "@/lib/api";

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
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    setForm(f => ({ 
      ...f, 
      name: user?.name || '', 
      phone: user?.phone || '' 
    }));
    setAvatarPreview(user?.avatar || null);
  }, [user]);

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
    const touristeUrl = process.env.NEXT_PUBLIC_TOURISTE_URL || 'http://localhost:3000';
    window.location.href = `${touristeUrl}/login`;
  };

  if (!user) return null;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 'clamp(0px, 15vw, 20px)' }}>
      {/* Petite infusion de CSS pour l'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 28px)', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>
          Mon Profil Administrateur
        </h1>
        <p style={{ color: 'var(--gray-600)', fontSize: 13 }}>
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      {/* Carte profil */}
      <div style={{ background: 'white', borderRadius: 16, padding: 'clamp(20px, 5vw, 32px)', boxShadow: 'var(--shadow-sm)', marginBottom: 24, border: '1px solid var(--gray-100)' }}>

        {/* Avatar + infos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0, margin: '0 auto' }} className="md:m-0">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                onClick={() => setShowZoom(true)}
                style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--blue-50)', cursor: 'zoom-in', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue-600), var(--blue-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 28, border: '4px solid var(--blue-50)' }}>
                {initials}
              </div>
            )}
            <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--blue-600)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid white', boxShadow: 'var(--shadow-md)' }}>
              <span style={{ color: 'white', fontSize: 16 }}>📷</span>
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
          <div style={{ flex: '1 1 300px', textAlign: 'center' }} className="md:text-left">
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--gray-900)', marginBottom: 6 }}>{user?.name}</div>
            <div style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 4, fontWeight: 500 }}>{user?.email}</div>
            {user?.phone && (
              <div style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>📞 {user.phone}</div>
            )}
            <div style={{ marginTop: 12 }}>
              <span style={{ background: 'var(--blue-50)', color: 'var(--blue-700)', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                👑 Administrateur
              </span>
            </div>
          </div>
          <button onClick={() => { setEditing(!editing); setMessage({type: '', text: ''}); }}
            style={{ background: editing ? 'var(--gray-100)' : 'var(--blue-600)', color: editing ? 'var(--gray-700)' : 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', flex: '1 1 100%', transition: 'all 0.2s' }} className="md:w-auto md:flex-initial">
            {editing ? 'Annuler l\'édition' : '✏️ Modifier le profil'}
          </button>
        </div>

        {/* Message feedback */}
        {message.text && (
          <div style={{ 
            background: message.type === 'success' ? '#d1fae5' : '#fef2f2', 
            color: message.type === 'success' ? '#065f46' : '#ef4444', 
            border: `1px solid ${message.type === 'success' ? '#6ee7b7' : '#fecaca'}`, 
            borderRadius: 12, 
            padding: '14px 20px', 
            marginBottom: 24, 
            fontSize: 14,
            fontWeight: 500
          }}>
            {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
          </div>
        )}

        {/* Formulaire modification */}
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray-500)', marginBottom: 8 }}>Nom complet</label>
              <input 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--gray-50)', color: 'var(--gray-900)' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray-500)', marginBottom: 8 }}>Téléphone</label>
              <input 
                value={form.phone} 
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+226 00 00 00 00"
                style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--gray-50)', color: 'var(--gray-900)' }} 
              />
            </div>
            <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 24, marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray-500)', marginBottom: 16 }}>Changer le mot de passe (optionnel)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input 
                  type="password" 
                  placeholder="Mot de passe actuel" 
                  value={form.currentPassword} 
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--gray-50)' }} 
                />
                <input 
                  type="password" 
                  placeholder="Nouveau mot de passe" 
                  value={form.newPassword} 
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--gray-50)' }} 
                />
                <input 
                  type="password" 
                  placeholder="Confirmer le nouveau mot de passe" 
                  value={form.confirmPassword} 
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--gray-50)' }} 
                />
              </div>
            </div>
            <button 
              onClick={handleSave} 
              disabled={saving}
              style={{ background: saving ? 'var(--blue-400)' : 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: 'var(--shadow-md)', marginTop: 8 }}
            >
              {saving ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
            </button>
          </div>
        ) : (
          <div>
            {[
              { label: 'Nom complet', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Téléphone', value: user?.phone || 'Non renseigné' },
              { label: 'Rôle', value: 'Administrateur' },
            ].map((item, idx) => (
              <div key={item.label} style={{ borderBottom: idx === 3 ? 'none' : '1px solid var(--gray-100)', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray-400)' }}>{item.label}</span>
                <span style={{ fontSize: 14, color: 'var(--gray-900)', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Déconnexion */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 16 }}>Compte & Session</h3>
        <button 
          onClick={handleLogout}
          style={{ width: '100%', background: 'var(--red-l)', border: '1.5px solid var(--red-l)', color: 'var(--red)', borderRadius: 10, padding: '14px', fontWeight: 700, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}
        >
          🚪 Se déconnecter de l'administration
        </button>
      </div>

      {/* Modal Zoom Image */}
      {showZoom && avatarPreview && (
        <div 
          onClick={() => setShowZoom(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out' }}
        >
          <img 
            src={avatarPreview} 
            alt="Zoom Avatar" 
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 20, boxShadow: '0 0 40px rgba(0,0,0,0.5)', border: '4px solid white' }} 
          />
          <button style={{ position: 'absolute', top: 20, right: 20, background: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
