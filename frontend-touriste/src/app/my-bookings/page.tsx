'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import api from '@/lib/api';
import { useCurrencyStore } from '@/lib/currency';

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

import { useTranslation } from '@/lib/i18n';

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  const { t, lang } = useTranslation();
  
  const [bookings, setBookings]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [mounted, setMounted]       = useState(false);
  const [reviewForm, setReviewForm] = useState<{ bookingId: string; destinationId: string } | null>(null);
  const [rating, setRating]         = useState(0);
  const [comment, setComment]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState('');

  const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
    CONFIRMED: { bg: 'rgba(52, 211, 153, 0.2)', color: '#059669', label: t('status_confirmed') },
    PENDING:   { bg: 'rgba(245, 158, 11, 0.2)', color: '#d97706', label: t('status_pending') },
    CANCELLED: { bg: 'rgba(239, 68, 68, 0.2)', color: '#dc2626', label: t('status_cancelled') },
    COMPLETED: { bg: 'rgba(59, 130, 246, 0.2)', color: '#2563eb', label: t('status_completed') },
  };

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
    if (!rating) return alert(lang === 'FR' ? 'Veuillez choisir une note !' : 'Please choose a rating!');
    if (!comment.trim()) return alert(lang === 'FR' ? 'Veuillez écrire un commentaire !' : 'Please write a comment!');
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        booking_id:     reviewForm?.bookingId,
        destination_id: reviewForm?.destinationId,
        rating,
        comment,
      });
      showToast(t('review_success'));
      setReviewForm(null);
      setRating(0);
      setComment('');
    } catch (e: any) {
      alert('Erreur : ' + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--gray)' }}>{t('loading')}</div>;

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: 80, background: 'var(--light-gray)', minHeight: 'calc(100vh - 64px)' }}>
        <p style={{ color: 'var(--gray)', marginBottom: 16 }}>{t('connect_to_see_bookings')}</p>
        <button onClick={() => router.push('/login')} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
          {t('login')}
        </button>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--gray)' }}>{t('loading')}</div>;

  return (
    <div style={{ background: 'var(--light-gray)', minHeight: 'calc(100vh - 64px)', padding: 'clamp(20px, 5vw, 40px) 0' }}>
     <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(16px, 4vw, 24px)' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, left: 20, background: '#0f2444', color: 'white', padding: '12px 24px', borderRadius: 12, zIndex: 9999, fontWeight: 700, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 700, marginBottom: 8, color: 'var(--dark)' }}>
        {t('my_bookings_title')}
      </h1>
      <p style={{ color: 'var(--gray)', marginBottom: 32, fontSize: '0.9rem' }}>{t('welcome_user')} {user?.name} 👋</p>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--white)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
          <p style={{ color: 'var(--gray)' }}>{t('no_bookings_yet')}</p>
          <button onClick={() => router.push('/destinations')} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', marginTop: 16, fontWeight: 600, width: '100%', maxWidth: 300 }}>
            {t('discover_destinations')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(booking => {
            const status = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
            const canReview = booking.status === 'COMPLETED';
            return (
              <div key={booking.id} style={{ background: 'var(--white)', borderRadius: 14, padding: 'clamp(16px, 4vw, 24px)', boxShadow: '0 4px 24px rgba(10,15,30,0.08)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: '1 1 250px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, color: 'var(--dark)' }}>
                      {booking.destinations?.name || 'Destination'}
                    </div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.85rem', marginBottom: 6 }}>
                      📅 {new Date(booking.check_in).toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-GB')} → {new Date(booking.check_out).toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-GB')}
                    </div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                      👥 {booking.nb_persons} {t('person_unit')} · 💰 {formatPrice(booking.total_price)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, width: '100%', maxWidth: 'none', flex: '1 1 auto' }} className="md:w-auto md:max-w-[200px]">
                    <span style={{ background: status.bg, color: status.color, padding: '4px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', width: 'fit-content' }}>
                      {status.label}
                    </span>
                    {canReview && (
                      <button
                        onClick={() => setReviewForm({ bookingId: booking.id, destinationId: booking.destination_id })}
                        style={{ background: 'rgba(26, 79, 214, 0.08)', color: '#1a4fd6', border: '1px solid rgba(26, 79, 214, 0.2)', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}
                      >
                        ⭐ {t('leave_review')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Formulaire avis */}
                {reviewForm?.bookingId === booking.id && (
                  <div style={{ marginTop: 16, padding: '16px', background: 'var(--light-gray)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, marginBottom: 10, color: 'var(--dark)' }}>{t('your_review')}</div>
                    <StarRating value={rating} onChange={setRating} />
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder={t('review_placeholder')}
                      style={{ width: '100%', marginTop: 10, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', fontSize: '0.9rem', minHeight: 80, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      <button onClick={() => { setReviewForm(null); setRating(0); setComment(''); }} style={{ flex: '1 1 120px', padding: '10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', cursor: 'pointer', fontWeight: 600 }}>
                        {t('cancel')}
                      </button>
                      <button onClick={handleSubmitReview} disabled={submitting} style={{ flex: '2 1 200px', padding: '10px', borderRadius: 8, border: 'none', background: '#1a4fd6', color: 'white', cursor: 'pointer', fontWeight: 700, opacity: submitting ? 0.6 : 1 }}>
                        {submitting ? t('sending') : `✅ ${t('send')}`}
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
    </div>
  );
}