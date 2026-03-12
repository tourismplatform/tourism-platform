"use client";
import { useState, useEffect } from "react";
import { adminAPI, bookingsAPI } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default function AdminDashboard() {
  const [stats, setStats]       = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), bookingsAPI.getAll()])
      .then(([s, b]) => {
        setStats(s.data || s);
        const bookingList = b.data || b.bookings || (Array.isArray(b) ? b : []);
        setBookings(bookingList.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  const cards = [
    { icon:"🗺️", label:"Destinations",         value: stats?.destinations    ?? "—", light:"var(--blue-50)"  },
    { icon:"📅", label:"Rés. en attente",       value: stats?.pendingBookings ?? "—", light:"#fef9c3"         },
    { icon:"💰", label:"Revenus",               value: stats?.revenue         ? Number(stats.revenue).toLocaleString("fr-FR") + " FCFA" : "—", light:"var(--green-l)" },
    { icon:"👥", label:"Utilisateurs",          value: stats?.users           ?? "—", light:"#f3e8ff"         },
  ];

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontFamily:"var(--font-title)", fontSize:28, color:"var(--gray-900)", marginBottom:4 }}>
          Tableau de bord
        </h2>
        <p style={{ color:"var(--gray-400)", fontSize:14 }}>Vue d'ensemble de la plateforme en temps réel.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:18, marginBottom:36 }}>
        {cards.map(c => (
          <div key={c.label} className="card" style={{ padding:24, display:"flex", gap:16, alignItems:"center" }}>
            <div style={{ width:50, height:50, borderRadius:12, background:c.light, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize:11, color:"var(--gray-400)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                {c.label}
              </div>
              <div style={{ fontFamily:"var(--font-title)", fontSize:24, fontWeight:700, color:"var(--gray-900)" }}>
                {c.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ padding:"18px 24px", borderBottom:"1px solid var(--gray-100)" }}>
          <div style={{ fontFamily:"var(--font-title)", fontSize:18, color:"var(--gray-900)" }}>
            📅 Dernières réservations
          </div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Touriste","Destination","Date","Personnes","Statut"].map(h => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={5} style={{ padding:32, textAlign:"center", color:"var(--gray-400)" }}>Aucune réservation.</td></tr>
            ) : bookings.map((b, i) => (
              <tr key={b.id || b._id} style={{ background: i%2===0 ? "var(--white)" : "var(--gray-50)" }}>
                <td className="td" style={{ fontWeight:700 }}>{b.users?.name || "—"}</td>
                <td className="td" style={{ color:"var(--gray-600)" }}>{b.destinations?.name || "—"}</td>
                <td className="td" style={{ color:"var(--gray-600)" }}>{new Date(b.check_in || b.date).toLocaleDateString("fr-FR")}</td>
                <td className="td" style={{ fontWeight:700, textAlign:"center" }}>{b.nb_persons || b.persons}</td>
                <td className="td"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}