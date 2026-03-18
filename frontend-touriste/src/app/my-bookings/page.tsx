'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import api from '@/lib/api';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  CONFIRMED: { bg: '#d1fae5', color: '#065f46', label: 'Confirmé' },
  PENDING:   { bg: '#fff3cd', color: '#b45309', label: 'En attente' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b', label: 'Annulé' },
  COMPLETED: { bg: '#dbeafe', color: '#1e40af', label: 'Terminé' },
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{ fontSize: 28, cursor: 'pointer', color: star <= value ? '#f59e0b' : '#d1d5db' }}
        >★</span>
      ))}
    </div>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [bookings, setBookings]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [mounted, setMounted]       = useState(false);
  const [reviewForm, setReviewForm] = useState<{ bookingId: string; destinationId: string } | null>(null);
  const [rating, setRating]         = useState(0);
  const [comment, setComment]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    api.get('/bookings/my')
      .then(res => setBookings(res.data.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, mounted]);

  const handleSubmitReview = async () => {
    if (!rating) return alert('Veuillez choisir une note !');
    if (!comment.trim()) return alert('Veuillez écrire un commentaire !');
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        booking_id:     reviewForm?.bookingId,
        destination_id: reviewForm?.destinationId,
        rating,
        comment,
      });
      showToast('✅ Avis envoyé avec succès !');
      setReviewForm(null);
      setRating(0);
      setComment('');
    } catch (e: any) {
      alert('Erreur : ' + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return <div style={{ textAlign: 'center', padding: 80 }}>Chargement...</div>;

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ color: '#6b7280', marginBottom: 16 }}>Connectez-vous pour voir vos réservations.</p>
        <button onClick={() => router.push('/login')} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
          Se connecter
        </button>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 900, margin: 'clamp(20px, 5vw, 40px) auto', padding: '0 clamp(16px, 4vw, 24px)' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, left: 20, background: '#0f2444', color: 'white', padding: '12px 24px', borderRadius: 12, zIndex: 9999, fontWeight: 700, textAlign: 'center' }}>
          {toast}
        </div>
      )}

      <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 700, marginBottom: 8, color: '#0a0f1e' }}>
        Mes Réservations
      </h1>
      <p style={{ color: '#6b7280', marginBottom: 32, fontSize: '0.9rem' }}>Bonjour {user?.name} 👋</p>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 14 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
          <p style={{ color: '#6b7280' }}>Vous n'avez pas encore de réservations.</p>
          <button onClick={() => router.push('/destinations')} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', marginTop: 16, fontWeight: 600, width: '100%', maxWidth: 300 }}>
            Découvrir les destinations
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(booking => {
            const status = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
            const canReview = booking.status === 'COMPLETED';
            return (
              <div key={booking.id} style={{ background: 'white', borderRadius: 14, padding: 'clamp(16px, 4vw, 24px)', boxShadow: '0 4px 24px rgba(10,15,30,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: '1 1 250px' }}>
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, width: '100%', maxWidth: 'none', flex: '1 1 auto' }} className="md:w-auto md:max-w-[200px]">
                    <span style={{ background: status.bg, color: status.color, padding: '4px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', width: 'fit-content' }}>
                      {status.label}
                    </span>
                    {canReview && (
                      <button
                        onClick={() => setReviewForm({ bookingId: booking.id, destinationId: booking.destination_id })}
                        style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}
                      >
                        ⭐ Laisser un avis
                      </button>
                    )}
                  </div>
                </div>

                {/* Formulaire avis */}
                {reviewForm?.bookingId === booking.id && (
                  <div style={{ marginTop: 16, padding: '16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, marginBottom: 10, color: '#0a0f1e' }}>📝 Votre avis</div>
                    <StarRating value={rating} onChange={setRating} />
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Décrivez votre expérience..."
                      style={{ width: '100%', marginTop: 10, padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', minHeight: 80, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      <button onClick={() => { setReviewForm(null); setRating(0); setComment(''); }} style={{ flex: '1 1 120px', padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600 }}>
                        Annuler
                      </button>
                      <button onClick={handleSubmitReview} disabled={submitting} style={{ flex: '2 1 200px', padding: '10px', borderRadius: 8, border: 'none', background: '#1a4fd6', color: 'white', cursor: 'pointer', fontWeight: 700, opacity: submitting ? 0.6 : 1 }}>
                        {submitting ? 'Envoi...' : '✅ Envoyer'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}