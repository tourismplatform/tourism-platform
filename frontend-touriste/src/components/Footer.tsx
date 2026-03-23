'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

const Footer = () => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t('assistance'),
      links: [
        { label: t('manage_trips'), href: '/my-bookings' },
        { label: t('contact_support'), href: '#' },
        { label: t('safety_center'), href: '#' },
        { label: t('help_faq'), href: '#' },
      ],
    },
    {
      title: t('discover'),
      links: [
        { label: t('popular_destinations_title'), href: '/destinations' },
        { label: t('culinary_experiences'), href: '#' },
        { label: t('world_heritage'), href: '#' },
        { label: t('national_parks'), href: '#' },
      ],
    },
    {
      title: t('terms'),
      links: [
        { label: t('privacy_policy'), href: '#' },
        { label: t('terms_service'), href: '#' },
        { label: t('cookie_settings'), href: '#' },
        { label: t('legal_mentions'), href: '#' },
      ],
    },
    {
      title: t('partners'),
      links: [
        { label: t('access_extranet'), href: 'http://localhost:3002' },
        { label: t('become_guide'), href: '#' },
        { label: t('add_destination'), href: '#' },
        { label: t('become_affiliate'), href: '#' },
      ],
    },
    {
      title: t('about'),
      links: [
        { label: t('about_us'), href: '#' },
        { label: t('sustainable_commitments'), href: '#' },
        { label: t('press_media'), href: '#' },
        { label: t('recruitment'), href: '#' },
      ],
    },
  ];

  return (
    <footer style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', paddingTop: 60, paddingBottom: 40, marginTop: 80 }}>
      {/* Footer Content */}
      <div className="container" style={{ margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '32px 16px', marginBottom: 60 }}>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{section.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 12 }}>
                    <Link href={link.href} style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', transition: 'all 0.2s', borderBottom: '1px solid transparent' }}>
                       {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ flex: '1 1 250px' }}>
                <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>
                    Tourism<span style={{ color: 'var(--accent)' }}>BF</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.6 }}>
                    {t('tourism_group_msg')}
                    <br />
                    {t('all_rights_reserved')} © 1996–2026 TourismBF™.
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Partner Logos Style branding */}
                <div style={{ display: 'flex', gap: 24, opacity: 0.5, filter: 'grayscale(1)', flexWrap: 'wrap' }}>
                   <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-1px' }}>Tourism</span>
                   <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-1px' }}>Heritage</span>
                   <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-1px' }}>Agoda</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
