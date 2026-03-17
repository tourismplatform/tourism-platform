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

      <div style={{ marginBottom:28, paddingTop: 'clamp(0px, 15vw, 40px)' }}>
        <h2 style={{ fontFamily:"var(--font-title)", fontSize:'clamp(1.5rem, 5vw, 28px)', color:"var(--gray-900)", margin:0 }}>
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
            borderRadius:20, padding:"8px 18px", fontSize:13, fontWeight:600,
            cursor:"pointer", fontFamily:"var(--font-body)", flex: '1 1 auto', textAlign: 'center'
          }}>
            {label} ({counts[val]})
          </button>
        ))}
      </div>

      {/* Vue Tableau (Desktop) */}
      <div className="card desktop-only" style={{ overflow:"hidden", marginTop: 20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Touriste</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Destination</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Date</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Pers.</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Total</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Statut</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:"var(--gray-400)" }}>Aucune réservation trouvée.</td></tr>
            ) : filtered.map((b, i) => (
              <tr key={b.id || b._id} style={{ borderBottom: '1px solid var(--gray-50)' }}>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ fontWeight:700, color:"var(--gray-900)", fontSize: 13 }}>{b.users?.name || "—"}</div>
                  <div style={{ fontSize:11, color:"var(--gray-400)" }}>{b.users?.email}</div>
                </td>
                <td style={{ padding: '12px 24px', color:"var(--gray-600)", fontSize:13 }}>{b.destinations?.name || "—"}</td>
                <td style={{ padding: '12px 24px', color:"var(--gray-600)", fontSize:13 }}>{new Date(b.check_in || b.date).toLocaleDateString("fr-FR")}</td>
                <td style={{ padding: '12px 24px', fontWeight:700, textAlign:"center", fontSize:13 }}>{b.nb_persons || b.persons}</td>
                <td style={{ padding: '12px 24px', fontWeight:700, color:"var(--blue-700)", fontSize:13 }}>
                  {Number(b.total_price || 0).toLocaleString("fr-FR")} F
                </td>
                <td style={{ padding: '12px 24px' }}><StatusBadge status={b.status} /></td>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ display:"flex", gap:6 }}>
                    {b.status !== "CONFIRMED" && b.status !== "COMPLETED" && (
                      <button onClick={() => setModal({ open:true, id:b.id, action:"CONFIRMED" })} style={{ background:"var(--green-l)", color:"var(--green)", border:"none", borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        ✓ Confirmer
                      </button>
                    )}
                    {b.status === "CONFIRMED" && (
                      <button onClick={() => setModal({ open:true, id:b.id, action:"COMPLETED" })} style={{ background:"#dbeafe", color:"#1e40af", border:"none", borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        ✅ Terminer
                      </button>
                    )}
                    {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                      <button onClick={() => setModal({ open:true, id:b.id, action:"CANCELLED" })} style={{ background:"var(--red-l)", color:"var(--red)", border:"none", borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
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

      {/* Vue Cartes (Mobile) */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding:40, textAlign:"center", color:"var(--gray-400)" }}>Aucune réservation trouvée.</div>
        ) : filtered.map((b) => (
          <div key={b.id || b._id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--gray-900)" }}>{b.users?.name || "Client Inconnu"}</div>
                <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{b.users?.email}</div>
              </div>
              <StatusBadge status={b.status} />
            </div>
            
            <div style={{ background: 'var(--gray-50)', borderRadius: 10, padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div className="label" style={{ fontSize: 9, marginBottom: 2 }}>Destination</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{b.destinations?.name || "—"}</div>
              </div>
              <div>
                <div className="label" style={{ fontSize: 9, marginBottom: 2 }}>Date</div>
                <div style={{ fontSize: 12 }}>{new Date(b.check_in || b.date).toLocaleDateString("fr-FR")}</div>
              </div>
              <div>
                <div className="label" style={{ fontSize: 9, marginBottom: 2 }}>Personnes</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{b.nb_persons || b.persons}</div>
              </div>
              <div>
                <div className="label" style={{ fontSize: 9, marginBottom: 2 }}>Total</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--blue-700)" }}>{Number(b.total_price || 0).toLocaleString("fr-FR")} F</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
              {b.status !== "CONFIRMED" && b.status !== "COMPLETED" && (
                <button 
                  onClick={() => setModal({ open:true, id:b.id, action:"CONFIRMED" })} 
                  style={{ background:"var(--green)", color:"white", border:"none", borderRadius:8, padding:"12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                >
                  ✓ Confirmer la réservation
                </button>
              )}
              {b.status === "CONFIRMED" && (
                <button 
                  onClick={() => setModal({ open:true, id:b.id, action:"COMPLETED" })} 
                  style={{ background:"var(--blue-600)", color:"white", border:"none", borderRadius:8, padding:"12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                >
                  ✅ Marquer comme terminée
                </button>
              )}
              {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                <button 
                  onClick={() => setModal({ open:true, id:b.id, action:"CANCELLED" })} 
                  style={{ background:"var(--red-l)", color:"var(--red)", border:"none", borderRadius:8, padding:"12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                >
                  ✕ Annuler la réservation
                </button>
              )}
            </div>
          </div>
        ))}
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