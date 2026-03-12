"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const NAV = [
  { href:"/admin",              icon:"📊", label:"Tableau de bord" },
  { href:"/admin/destinations", icon:"🗺️", label:"Destinations" },
  { href:"/admin/bookings",     icon:"📅", label:"Réservations" },
  { href:"/admin/reviews",      icon:"⭐", label:"Avis" },
  { href:"/admin/users",        icon:"👥", label:"Utilisateurs" },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>

      {/* SIDEBAR */}
      <aside style={{ width:256, background:"var(--blue-950)", display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", flexShrink:0 }}>
        
        {/* Logo */}
        <div style={{ padding:"28px 24px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"var(--blue-600)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌍</div>
            <div>
              <div style={{ fontFamily:"var(--font-title)", fontSize:15, color:"var(--white)", lineHeight:1 }}>Burkina Tourisme</div>
              <div style={{ fontSize:10, color:"var(--blue-400)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Administration</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding:"16px 12px", flex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", letterSpacing:"0.1em", padding:"0 12px 8px" }}>Menu</div>
          {NAV.map(({ href, icon, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, marginBottom:2, fontSize:13, fontWeight:active?700:400, background:active?"var(--blue-600)":"transparent", color:active?"var(--white)":"rgba(255,255,255,0.45)", textDecoration:"none" }}>
                <span style={{ fontSize:15 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"var(--blue-600)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"var(--white)", fontSize:14 }}>A</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--white)" }}>Administrateur</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>Admin</div>
            </div>
          </div>
          <button onClick={() => { if(logout) logout(); window.location.href = "http://localhost:3000"; }} style={{ width:"100%", padding:"8px", borderRadius:8, fontSize:12, fontWeight:600, background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.3)", color:"#fca5a5", cursor:"pointer", fontFamily:"var(--font-body)" }}>
            🚪 Se déconnecter
          </button>
        </div>
      </aside>

      {/* CONTENU */}
      <main style={{ flex:1, background:"var(--gray-50)", padding:"36px 44px", overflowY:"auto" }}>
        {children}
      </main>

    </div>
  );
}