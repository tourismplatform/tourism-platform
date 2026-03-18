"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";

const NAV = [
  { href:"/admin",              icon:"📊", label:"Tableau de bord" },
  { href:"/admin/destinations", icon:"🗺️", label:"Destinations" },
  { href:"/admin/bookings",     icon:"📅", label:"Réservations" },
  { href:"/admin/reviews",      icon:"⭐", label:"Avis" },
  { href:"/admin/users",        icon:"👥", label:"Utilisateurs" },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      const touristeUrl = process.env.NEXT_PUBLIC_TOURISTE_URL || 'http://localhost:3000';
      window.location.href = `${touristeUrl}/login`;
    }
  }, [user, loading]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f1efe8" }}>
        <div style={{ textAlign:"center", color:"#888780" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
          <div style={{ fontSize:14 }}>Vérification en cours...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", position: "relative" }}>

      {/* MOBILE TOPBAR */}
      <header className="mobile-topbar" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: 60, 
        background: 'var(--blue-950)', color: 'white', 
        alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 20px', zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontFamily: "var(--font-title)", fontWeight: 800, fontSize: 18, color: '#1a4fd6' }}>
            Tourism<span style={{ color: '#ff5722' }}>BF</span>
          </div>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4 }}>Admin</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer' }}
        >
          ☰
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 110 }}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        style={{ 
          width:256, background:"var(--blue-950)", 
          flexDirection:"column", position:"sticky", top:0, height:"100vh", 
          flexShrink:0, zIndex: 120, transition: 'transform 0.3s ease'
        }}
        className={`admin-sidebar ${sidebarOpen ? 'sidebar-active' : ''}`}
      >
        
        {/* Logo / Header Sidebar */}
        <div style={{ padding:"28px 24px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          
          <button 
            className="mobile-only"
            onClick={() => {
              console.log("Mobile Close Clicked");
              setSidebarOpen(false);
            }}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: 'none', 
              color: 'white', 
              fontSize: 24, 
              cursor: 'pointer',
              width: 44,
              height: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              zIndex: 251,
              padding: 0
            }}
            title="Fermer le menu"
          >
            ✕
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div>
              <div style={{ fontFamily:"var(--font-title)", fontSize:20, fontWeight: 800, color:"#1a4fd6", lineHeight:1.2 }}>
                Tourism<span style={{ color: '#ff5722' }}>BF</span>
              </div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.15em", marginTop: 2 }}>Administration</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding:"16px 12px", flex:1, overflowY: 'auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", letterSpacing:"0.1em", padding:"0 12px 8px" }}>Menu</div>
          {NAV.map(({ href, icon, label }) => {
            const active = pathname === href;
            return (
              <Link 
                key={href} 
                href={href} 
                onClick={() => setSidebarOpen(false)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, marginBottom:2, fontSize:13, fontWeight:active?700:400, background:active?"var(--blue-600)":"transparent", color:active?"var(--white)":"rgba(255,255,255,0.45)", textDecoration:"none" }}
              >
                <span style={{ fontSize:15 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <Link 
            href="/admin/profile" 
            onClick={() => setSidebarOpen(false)}
            style={{ textDecoration: 'none' }}
          >
            <div style={{ 
              display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"10px", borderRadius:"12px",
              background: pathname === "/admin/profile" ? "var(--blue-600)" : "transparent",
              transition: 'background 0.2s'
            }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"var(--blue-600)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"var(--white)", fontSize:15, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "A"
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--white)" }}>{user?.name || "Administrateur"}</div>
                <div style={{ fontSize:11, color: pathname === "/admin/profile" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>{user?.email}</div>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* CONTENU */}
      <main style={{ flex:1, background:"var(--gray-50)", padding:"clamp(20px, 5vw, 44px)", overflowY:"auto", width: '100%' }} className="admin-main">
        {children}
      </main>

    </div>
  );
}