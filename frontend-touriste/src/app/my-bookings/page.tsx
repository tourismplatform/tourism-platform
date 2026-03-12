'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import api from '@/lib/api';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  CONFIRMED: { bg: '#d1fae5', color: '#065f46', label: 'Confirmé' },
  PENDING: { bg: '#fff3cd', color: '#b45309', label: 'En attente' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b', label: 'Annulé' },
  COMPLETED: { bg: '#dbeafe', color: '#1e40af', label: 'Terminé' },
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    api.get('/bookings/my')
      .then(res => setBookings(res.data.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, mounted]);

  if (!mounted) return <div style={{ textAlign: 'center', padding: 80 }}>Chargement...</div>;

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ color: '#6b7280', marginBottom: 16 }}>Connectez-vous pour voir vos réservations.</p>
        <button onClick={() => router.push('/login')} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 }}>
          Se connecter
        </button>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 700, marginBottom: 8, color: '#0a0f1e' }}>Mes Réservations</h1>
      <p style={{ color: '#6b7280', marginBottom: 32, fontSize: '0.9rem' }}>Bonjour {user?.name} 👋</p>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 14 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
          <p style={{ color: '#6b7280' }}>Vous n'avez pas encore de réservations.</p>
          <button onClick={() => router.push('/destinations')} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', marginTop: 16, fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 }}>
            Découvrir les destinations
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(booking => {
            const status = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
            return (
              <div key={booking.id} style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 4px 24px rgba(10,15,30,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, color: '#0a0f1e' }}>
                    {booking.destinations?.name || 'Destination'}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: 6 }}>
                    📅 {new Date(booking.check_in).toLocaleDateString('fr-FR')} → {new Date(booking.check_out).toLocaleDateString('fr-FR')}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    👥 {booking.nb_persons} personne(s) · 💰 {booking.total_price.toLocaleString()} FCFA
                  </div>
                </div>
                <span style={{ background: status.bg, color: status.color, padding: '4px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.3px' }}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}