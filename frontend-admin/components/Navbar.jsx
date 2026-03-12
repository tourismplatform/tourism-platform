"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const { user, isAdmin, isTouriste, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  if (pathname?.startsWith("/admin")) return null;

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "var(--blue-950)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "0 48px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      height: 66,
    }}>
      {/* Logo */}
      <Link href="/" style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"var(--blue-600)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
          🌍
        </div>
        <div>
          <div style={{ fontFamily:"var(--font-title)", fontSize:16, fontWeight:700, color:"var(--white)", lineHeight:1 }}>
            Burkina Tourisme
          </div>
          <div style={{ fontSize:9, color:"var(--blue-400)", letterSpacing:"0.12em", textTransform:"uppercase" }}>
            Land of Upright People
          </div>
        </div>
      </Link>

      {/* Liens */}
      <div style={{ display:"flex", gap:2 }}>
        {[
          { href:"/",             label:"Accueil" },
          { href:"/destinations", label:"Destinations" },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            padding: "7px 16px", borderRadius: 8,
            fontSize: 13, fontWeight: 500,
            color: pathname === href ? "var(--white)" : "var(--blue-400)",
            background: pathname === href ? "rgba(255,255,255,0.1)" : "transparent",
          }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Auth */}
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        {!user && (<>
          <Link href="/login" style={{ padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, color:"var(--blue-400)", border:"1px solid rgba(255,255,255,0.12)" }}>
            Se connecter
          </Link>
          <Link href="/register" style={{ padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, color:"var(--white)", background:"var(--blue-600)" }}>
            Créer un compte
          </Link>
        </>)}

        {isTouriste && (<>
          <Link href="/my-bookings" style={{ padding:"7px 16px", borderRadius:8, fontSize:13, color:"var(--blue-400)" }}>
            📅 Mes réservations
          </Link>
          <Link href="/profile" style={{ padding:"7px 16px", borderRadius:8, fontSize:13, color:"var(--blue-400)" }}>
            👤 Mon profil
          </Link>
          <button onClick={handleLogout} style={{ padding:"7px 16px", borderRadius:8, fontSize:13, fontWeight:600, color:"#fca5a5", background:"rgba(220,38,38,0.12)", border:"none", cursor:"pointer", fontFamily:"var(--font-body)" }}>
            Déconnexion
          </button>
        </>)}

        {isAdmin && (<>
          <Link href="/admin" style={{ padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, color:"var(--white)", background:"var(--blue-600)" }}>
            ⚙️ Admin
          </Link>
          <button onClick={handleLogout} style={{ padding:"7px 16px", borderRadius:8, fontSize:13, fontWeight:600, color:"#fca5a5", background:"rgba(220,38,38,0.12)", border:"none", cursor:"pointer", fontFamily:"var(--font-body)" }}>
            Déconnexion
          </button>
        </>)}
      </div>
    </nav>
  );
}