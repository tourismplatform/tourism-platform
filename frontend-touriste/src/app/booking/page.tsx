'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';

export default function BookingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [txn, setTxn] = useState('');

  const bookingData = {
    destination_name: 'Parc National du W',
    start_date: '2026-04-10',
    end_date: '2026-04-12',
    nb_persons: 2,
    total_price: 30000,
  };

  const doPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setTxn(String(Math.floor(Math.random() * 90000 + 10000)));
      setStep(3);
      setLoading(false);
    }, 1800);
  };

  const steps = [
    { n: 1, label: 'Récapitulatif' },
    { n: 2, label: 'Paiement' },
    { n: 3, label: 'Confirmation' },
  ];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>

      {/* ÉTAPES */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem',
                background: step > s.n ? '#00875a' : step === s.n ? '#1a4fd6' : '#e5e7eb',
                color: step >= s.n ? 'white' : '#6b7280'
              }}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span style={{ fontSize: '0.78rem', color: step === s.n ? '#1a4fd6' : '#6b7280', fontWeight: step === s.n ? 700 : 400 }}>{s.label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > s.n ? '#00875a' : '#e5e7eb', margin: '0 8px', marginBottom: 20 }} />}
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(10,15,30,0.08)', padding: 32 }}>

        {/* ÉTAPE 1 — Récapitulatif */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: 24 }}>Récapitulatif</h2>
            <div style={{ background: '#f4f6fa', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              {[
                ['Destination', bookingData.destination_name],
                ['Arrivée', new Date(bookingData.start_date).toLocaleDateString('fr-FR')],
                ['Départ', new Date(bookingData.end_date).toLocaleDateString('fr-FR')],
                ['Personnes', `${bookingData.nb_persons}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 700, fontSize: '1.1rem', color: '#1a4fd6' }}>
                <span>Total</span>
                <span>{bookingData.total_price.toLocaleString()} FCFA</span>
              </div>
            </div>
            <button onClick={() => setStep(2)} style={{ width: '100%', background: '#1a4fd6', color: 'white', border: 'none', padding: 16, borderRadius: 10, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif' }}>
              Continuer vers le paiement →
            </button>
          </>
        )}

        {/* ÉTAPE 2 — Paiement */}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>Paiement</h2>
            <p style={{ color: '#6b7280', marginBottom: 24, fontSize: '0.9rem' }}>Montant à payer : <strong style={{ color: '#1a4fd6' }}>{bookingData.total_price.toLocaleString()} FCFA</strong></p>

            {/* Méthodes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[{ icon: '💳', label: 'Carte bancaire' }, { icon: '📱', label: 'Mobile Money' }].map(m => (
                <div key={m.label} style={{ border: '2px solid #1a4fd6', borderRadius: 12, padding: 16, textAlign: 'center', cursor: 'pointer', background: '#eff6ff' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a4fd6' }}>{m.label}</div>
                </div>
              ))}
            </div>

            <button onClick={doPayment} disabled={loading} style={{ width: '100%', background: loading ? '#93c5fd' : '#ff5722', color: 'white', border: 'none', padding: 16, borderRadius: 10, fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-outfit), sans-serif' }}>
              {loading ? '⏳ Traitement en cours...' : '💳 Confirmer le paiement'}
            </button>
            <button onClick={() => setStep(1)} style={{ width: '100%', background: 'transparent', border: 'none', color: '#6b7280', marginTop: 12, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
              ← Retour
            </button>
          </>
        )}

        {/* ÉTAPE 3 — Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '2rem', fontWeight: 700, color: '#00875a', marginBottom: 8 }}>
              Réservation confirmée !
            </h2>
            <p style={{ color: '#6b7280', marginBottom: 8 }}>Votre réservation a été enregistrée avec succès.</p>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 32 }}>N° de transaction : <strong>#{txn}</strong></p>
            <button onClick={() => router.push('/')} style={{ background: '#1a4fd6', color: 'white', border: 'none', padding: '12px 32px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif' }}>
              Retour à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
