'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrencyStore, CurrencyCode } from '@/lib/currency';

const Footer = () => {
  const { currency, setCurrency } = useCurrencyStore();
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  const footerSections = [
    {
      title: 'Assistance',
      links: [
        { label: 'Gérez vos voyages', href: '/my-bookings' },
        { label: 'Contacter le Service Clients', href: '#' },
        { label: 'Centre des ressources de sécurité', href: '#' },
        { label: 'Aide et FAQ', href: '#' },
      ],
    },
    {
      title: 'À découvrir',
      links: [
        { label: 'Destinations populaires', href: '/destinations' },
        { label: 'Expériences culinaires', href: '#' },
        { label: 'Patrimoine mondial', href: '#' },
        { label: 'Parcs Nationaux', href: '#' },
      ],
    },
    {
      title: 'Conditions',
      links: [
        { label: 'Charte de confidentialité', href: '#' },
        { label: 'Conditions de Service', href: '#' },
        { label: 'Paramètres des cookies', href: '#' },
        { label: 'Mentions Légales', href: '#' },
      ],
    },
    {
      title: 'Partenaires',
      links: [
        { label: 'Accéder à l\'extranet', href: 'http://localhost:3002' },
        { label: 'Devenir Guide local', href: '#' },
        { label: 'Ajouter ma destination', href: '#' },
        { label: 'Devenir affilié', href: '#' },
      ],
    },
    {
      title: 'À propos',
      links: [
        { label: 'À propos de TourismBF', href: '#' },
        { label: 'Nos engagements durable', href: '#' },
        { label: 'Presse et Médias', href: '#' },
        { label: 'Recrutement', href: '#' },
      ],
    },
  ];

  const currencies: { code: CurrencyCode; label: string; flag: string }[] = [
    { code: 'XOF', label: 'Franc CFA (BCEAO)', flag: '🇧🇫' },
    { code: 'EUR', label: 'Euro', flag: '🇪🇺' },
    { code: 'USD', label: 'Dollar Américain', flag: '🇺🇸' },
  ];

  const currentCurrencyData = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <footer style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', paddingTop: 60, paddingBottom: 40, marginTop: 80 }}>
      {/* Footer Content */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 60 }}>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0a0f1e', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{section.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 12 }}>
                    <Link href={link.href} style={{ fontSize: 13, color: '#1a4fd6', textDecoration: 'none', transition: 'all 0.2s', borderBottom: '1px solid transparent' }}>
                       {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 32 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ flex: '1 1 300px' }}>
                <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', fontWeight: 700, color: '#1a4fd6', marginBottom: 12 }}>
                    Tourism<span style={{ color: '#ff5722' }}>BF</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
                    TourismBF fait partie de Tourism Group Inc., le leader mondial du voyage en ligne et services associés au Burkina Faso. 
                    Tous droits réservés © 1996–2026 TourismBF™.
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div 
                  onClick={() => setIsCurrencyModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '8px 16px', borderRadius: 10, border: '1px solid #cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1a4fd6'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                >
                   <span style={{ fontSize: 20 }}>{currentCurrencyData.flag}</span>
                   <span style={{ fontSize: 14, fontWeight: 700, color: '#0f2444' }}>{currency}</span>
                </div>
                
                {/* Partner Logos Style branding */}
                <div style={{ display: 'flex', gap: 24, opacity: 0.5, filter: 'grayscale(1)' }}>
                   <span style={{ fontSize: 16, fontWeight: 900, color: '#003580', letterSpacing: '-1px' }}>Tourism</span>
                   <span style={{ fontSize: 16, fontWeight: 900, color: '#003580', letterSpacing: '-1px' }}>Heritage</span>
                   <span style={{ fontSize: 16, fontWeight: 900, color: '#003580', letterSpacing: '-1px' }}>Agoda</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Modal */}
      {isCurrencyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 16, width: '90%', maxWidth: 500, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0a0f1e', margin: 0 }}>Choisir une devise</h3>
              <button 
                onClick={() => setIsCurrencyModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6b7280' }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currencies.map((c) => (
                <div 
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setIsCurrencyModalOpen(false);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 12, cursor: 'pointer',
                    background: currency === c.code ? '#eff6ff' : 'white',
                    border: `1.5px solid ${currency === c.code ? '#1a4fd6' : '#e2e8f0'}`,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if (currency !== c.code) e.currentTarget.style.borderColor = '#1a4fd6'; }}
                  onMouseLeave={e => { if (currency !== c.code) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <span style={{ fontSize: 24 }}>{c.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0a0f1e' }}>{c.code}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{c.label}</div>
                  </div>
                  {currency === c.code && <span style={{ color: '#1a4fd6', fontWeight: 900 }}>✓</span>}
                </div>
              ))}
            </div>
            
            <p style={{ marginTop: 24, fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
              Le taux de conversion est mis à jour régulièrement.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
