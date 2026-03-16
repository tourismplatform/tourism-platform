"use client";
import { useState, useEffect } from "react";

import { bookingsAPI } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminBookings() {
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [toast, setToast]       = useState("");
  const [modal, setModal]       = useState({ open:false, id:null, action:null });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = () => {
    bookingsAPI.getAll()
      .then(d => { 
        setBookings(d.data || d.bookings || (Array.isArray(d) ? d : [])); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  const handleAction = async () => {
    try {
      await bookingsAPI.updateStatus(modal.id, { status: modal.action });
      showToast(modal.action === "CONFIRMED" ? "✅ Réservation confirmée !" : "❌ Réservation annulée.");
      setModal({ open:false, id:null, action:null });
      load();
    } catch(e) { alert("Erreur : " + e.message); }
  };

  const counts = {
    all:       bookings.length,
    PENDING:   bookings.filter(b => b.status === "PENDING").length,
    CONFIRMED: bookings.filter(b => b.status === "CONFIRMED").length,
    CANCELLED: bookings.filter(b => b.status === "CANCELLED").length,
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"50vh", color:"var(--gray-400)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
        Chargement...
      </div>
    </div>
  );

  return (
    <div>
      {toast && (
        <div style={{ position:"fixed", top:20, right:20, background:"var(--blue-900)", color:"var(--white)", padding:"12px 24px", borderRadius:12, zIndex:9999, fontWeight:700, fontSize:14, boxShadow:"var(--shadow-lg)" }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:"var(--font-title)", fontSize:28, color:"var(--gray-900)", margin:0 }}>
          Gestion des Réservations
        </h2>
        <p style={{ color:"var(--gray-400)", fontSize:13, marginTop:4 }}>{bookings.length} réservation(s) au total</p>
      </div>

      {/* Filtres */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {[["all","Toutes"], ["PENDING","En attente"], ["CONFIRMED","Confirmées"], ["CANCELLED","Annulées"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            background: filter===val ? "var(--blue-600)" : "var(--white)",
            color:      filter===val ? "var(--white)"    : "var(--gray-600)",
            border:     `1.5px solid ${filter===val ? "var(--blue-600)" : "var(--gray-200)"}`,
            borderRadius:20, padding:"7px 18px", fontSize:13, fontWeight:600,
            cursor:"pointer", fontFamily:"var(--font-body)",
          }}>
            {label} ({counts[val]})
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="card" style={{ overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Touriste","Destination","Date","Pers.","Total","Statut","Actions"].map(h => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:"var(--gray-400)" }}>Aucune réservation trouvée.</td></tr>
            ) : filtered.map((b, i) => (
              <tr key={b.id || b._id} style={{ background: i%2===0 ? "var(--white)" : "var(--gray-50)" }}>
                <td className="td">
                  <div style={{ fontWeight:700, color:"var(--gray-900)" }}>{b.users?.name || "—"}</div>
                  <div style={{ fontSize:11, color:"var(--gray-400)" }}>{b.users?.email}</div>
                </td>
                <td className="td" style={{ color:"var(--gray-600)", fontSize:13 }}>{b.destinations?.name || "—"}</td>
                <td className="td" style={{ color:"var(--gray-600)", fontSize:13 }}>{new Date(b.check_in || b.date).toLocaleDateString("fr-FR")}</td>
                <td className="td" style={{ fontWeight:700, textAlign:"center" }}>{b.nb_persons || b.persons}</td>
                <td className="td" style={{ fontWeight:700, color:"var(--blue-700)", fontSize:13 }}>
                  {Number(b.total_price || 0).toLocaleString("fr-FR")} FCFA
                </td>
                <td className="td"><StatusBadge status={b.status} /></td>
                <td className="td">
                  <div style={{ display:"flex", gap:6 }}>
                   {b.status !== "CONFIRMED" && b.status !== "COMPLETED" && (
  <button onClick={() => setModal({ open:true, id:b.id, action:"CONFIRMED" })} style={{ background:"var(--green-l)", color:"var(--green)", border:"none", borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>
    ✓ Confirmer
  </button>
)}
{b.status === "CONFIRMED" && (
  <button onClick={() => setModal({ open:true, id:b.id, action:"COMPLETED" })} style={{ background:"#dbeafe", color:"#1e40af", border:"none", borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>
    ✅ Terminer
  </button>
)}
{b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
  <button onClick={() => setModal({ open:true, id:b.id, action:"CANCELLED" })} style={{ background:"var(--red-l)", color:"var(--red)", border:"none", borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>
    ✕ Annuler
  </button>
)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={modal.open}
       title={
  modal.action === "CONFIRMED" ? "Confirmer cette réservation ?" :
  modal.action === "COMPLETED" ? "Marquer comme terminée ?" :
  "Annuler cette réservation ?"
}
        message="Le touriste sera notifié par email."
       confirmLabel={
  modal.action === "CONFIRMED" ? "✓ Oui, confirmer" :
  modal.action === "COMPLETED" ? "✅ Oui, terminer" :
  "✕ Oui, annuler"
}
confirmColor={
  modal.action === "CONFIRMED" ? "var(--green)" :
  modal.action === "COMPLETED" ? "#1e40af" :
  "var(--red)"
}
        onConfirm={handleAction}
        onCancel={() => setModal({ open:false, id:null, action:null })}
      />
    </div>
  );
}