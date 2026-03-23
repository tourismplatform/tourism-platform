'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useCurrencyStore } from '@/lib/currency';

import { useTranslation } from '@/lib/i18n';

function BookingContent() {
  const router = useRouter();
  const { formatPrice } = useCurrencyStore();
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [txn, setTxn] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  const destination_id = searchParams.get('destination_id') || '';
  const check_in = searchParams.get('check_in') || '';
  const check_out = searchParams.get('check_out') || '';
  const nb_persons = Number(searchParams.get('nb_persons') || 1);
  const total_price = Number(searchParams.get('total_price') || 0);
  const [destinationName, setDestinationName] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/booking');
      return;
    }
    if (destination_id) {
      api.get(`/destinations/${destination_id}`)
        .then(res => setDestinationName(res.data.data.name))
        .catch(() => setDestinationName('Destination'));
    }
  }, [destination_id, isAuthenticated]);

  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'MOBILE_MONEY' | null>(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [mmPhone, setMmPhone] = useState('');

  const doBookingAndPayment = async () => {
    if (!paymentMethod) {
      setError(t('choose_payment_method'));
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const bookingRes = await api.post('/bookings', {
        destination_id,
        check_in,
        check_out,
        nb_persons,
        total_price,
      });
      const newBookingId = bookingRes.data.data.id;
      setBookingId(newBookingId);

      const paymentPayload: any = {
        booking_id: newBookingId,
        amount: total_price,
        currency: 'XOF',
        method: paymentMethod,
      };

      if (paymentMethod === 'CARD') {
        paymentPayload.card_number = cardDetails.number || '4111111111111111';
      } else {
        paymentPayload.phone = mmPhone || '00000000';
      }

      const paymentRes = await api.post('/payments/process', paymentPayload);
      setTxn(paymentRes.data.data.transaction_id || 'MOCK_' + Date.now());
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || t('booking_error'));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { n: 1, label: t('step_recap') },
    { n: 2, label: t('step_payment') },
    { n: 3, label: t('step_confirm') },
  ];

  return (
    <div style={{ background: 'var(--light-gray)', minHeight: 'calc(100vh - 64px)', padding: 'clamp(20px, 5vw, 40px) 0' }}>
     <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 clamp(16px, 4vw, 20px)' }}>

      {/* ÉTAPES */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40, justifyContent: 'space-between' }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 'clamp(32px, 8vw, 40px)', height: 'clamp(32px, 8vw, 40px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem',
                background: step > s.n ? '#00875a' : step === s.n ? '#1a4fd6' : 'var(--border)',
                color: step >= s.n ? 'white' : 'var(--gray)'
              }}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span style={{ fontSize: '0.7rem', color: step === s.n ? '#1a4fd6' : 'var(--gray)', fontWeight: step === s.n ? 700 : 400, textAlign: 'center' }}>{s.label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > s.n ? '#00875a' : 'var(--border)', margin: '0 4px', marginBottom: 20 }} />}
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: '0 4px 24px rgba(10,15,30,0.08)', padding: 'clamp(20px, 5vw, 32px)' }}>

        {/* ÉTAPE 1 — Récapitulatif */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: 24, color: 'var(--dark)' }}>{t('step_recap')}</h2>
            <div style={{ background: 'var(--light-gray)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, border: '1px solid var(--border)' }}>
              {[
                ['Destination', destinationName],
                [t('arrival'), check_in ? new Date(check_in).toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-GB') : '—'],
                [t('departure'), check_out ? new Date(check_out).toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-GB') : '—'],
                [t('persons_label'), `${nb_persons}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--dark)' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontWeight: 700, fontSize: '1.1rem', color: '#1a4fd6' }}>
                <span>{t('total')}</span>
                <span>{formatPrice(total_price)}</span>
              </div>
            </div>
            <button onClick={() => setStep(2)} style={{ width: '100%', background: '#1a4fd6', color: 'white', border: 'none', padding: 16, borderRadius: 10, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('continue_to_payment')} →
            </button>
          </>
        )}

        {/* ÉTAPE 2 — Paiement */}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: 8, color: 'var(--dark)' }}>{t('step_payment')}</h2>
            <p style={{ color: 'var(--gray)', marginBottom: 24, fontSize: '0.9rem' }}>{t('amount_to_pay')} : <strong style={{ color: '#1a4fd6' }}>{formatPrice(total_price)}</strong></p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#ef4444', fontSize: '0.88rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
              {[
                { id: 'CARD', icon: '💳', label: t('card_payment') },
                { id: 'MOBILE_MONEY', icon: '📱', label: t('mm_payment') }
              ].map(m => (
                <div 
                  key={m.id} 
                  onClick={() => setPaymentMethod(m.id as any)}
                  style={{ 
                    border: paymentMethod === m.id ? '2px solid #1a4fd6' : '1px solid var(--border)', 
                    borderRadius: 12, 
                    padding: 16, 
                    textAlign: 'center', 
                    cursor: 'pointer', 
                    background: paymentMethod === m.id ? 'rgba(26, 79, 214, 0.08)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: paymentMethod === m.id ? '#1a4fd6' : 'var(--gray)' }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Formulaire Carte Bancaire */}
            {paymentMethod === 'CARD' && (
              <div style={{ animation: 'fadeIn 0.3s', marginBottom: 24 }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray)', marginBottom: 6 }}>{t('card_number')}</label>
                  <input 
                    type="text" 
                    placeholder="xxxx xxxx xxxx xxxx" 
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray)', marginBottom: 6 }}>{t('expiry_date')}</label>
                    <input 
                      type="text" 
                      placeholder="MM/AA" 
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', outline: 'none', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray)', marginBottom: 6 }}>{t('cvv')}</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', outline: 'none', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire Mobile Money */}
            {paymentMethod === 'MOBILE_MONEY' && (
              <div style={{ animation: 'fadeIn 0.3s', marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray)', marginBottom: 6 }}>{t('phone_number')}</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ padding: '12px 10px', background: 'var(--light-gray)', borderRadius: 8, color: 'var(--gray)', fontSize: '0.9rem', fontWeight: 600, border: '1px solid var(--border)' }}>+226</div>
                    <input 
                      type="tel" 
                      placeholder="00 00 00 00" 
                      value={mmPhone}
                      onChange={(e) => setMmPhone(e.target.value)}
                      style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--dark)', outline: 'none', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <button onClick={doBookingAndPayment} disabled={loading} style={{ width: '100%', background: loading ? '#93c5fd' : '#ff5722', color: 'white', border: 'none', padding: 16, borderRadius: 10, fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? `⏳ ${t('processing')}` : `💳 ${t('confirm_payment')}`}
            </button>
            <button onClick={() => setStep(1)} style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--gray)', marginTop: 12, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit' }}>
              ← {t('back')}
            </button>
          </>
        )}

        {/* ÉTAPE 3 — Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📩</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 700, color: '#1a4fd6', marginBottom: 8 }}>
              {t('booking_success')}
            </h2>
            <p style={{ color: 'var(--gray)', marginBottom: 16, fontSize: '0.95rem' }}>{t('booking_success_msg')}</p>
            <p style={{ color: 'var(--dark)', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem' }}>{t('admin_validation_msg')}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray)', marginBottom: 32 }}>{t('check_my_bookings_msg')}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/my-bookings')} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 32px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flex: '1 1 auto' }}>
                {t('my_bookings')}
              </button>
              <button onClick={() => router.push('/')} style={{ background: 'transparent', color: '#1a4fd6', border: '2px solid #1a4fd6', padding: '12px 32px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flex: '1 1 auto' }}>
                {t('home')}
              </button>
            </div>
          </div>
        )}
      </div>
     </div>
    </div>
  );
}

export default function BookingPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 80, color: 'var(--gray)' }}>{t('loading')}</div>}>
      <BookingContent />
    </Suspense>
  );
}