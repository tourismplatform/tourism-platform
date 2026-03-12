"use client";
import { useState, useEffect } from "react";

import { reviewsAPI } from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";

const Stars = ({ rating }) => (
  <span style={{ color:"var(--blue-600)", fontSize:14 }}>
    {"★".repeat(rating)}{"☆".repeat(5 - rating)}
  </span>
);

export default function AdminReviews() {
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState("");
  const [modal, setModal]     = useState({ open:false, id:null });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = () => {
    reviewsAPI.getAll()
      .then(d => { 
        setReviews(d.data || d.reviews || (Array.isArray(d) ? d : [])); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async () => {
    try {
      await reviewsAPI.delete(modal.id);
      showToast("🗑 Avis supprimé.");
      setModal({ open:false, id:null });
      load();
    } catch(e) { alert("Erreur : " + e.message); }
  };

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
          Modération des Avis
        </h2>
        <p style={{ color:"var(--gray-400)", fontSize:13, marginTop:4 }}>{reviews.length} avis publié(s)</p>
      </div>

      {reviews.length === 0 ? (
        <div className="card" style={{ padding:60, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>⭐</div>
          <div style={{ fontFamily:"var(--font-title)", fontSize:20, color:"var(--gray-900)" }}>
            Aucun avis pour l'instant
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {reviews.map(r => (
            <div key={r.id || r._id} className="card" style={{ padding:22, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
              <div style={{ display:"flex", gap:14, flex:1 }}>

                {/* Avatar */}
                <div style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,var(--blue-600),var(--blue-800))", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"var(--white)", fontSize:18, flexShrink:0 }}>
                  {(r.users?.name || "?").charAt(0).toUpperCase()}
                </div>

                <div style={{ flex:1 }}>
                  {/* Nom + date */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
                    <span style={{ fontWeight:700, color:"var(--gray-900)", fontSize:14 }}>
                      {r.users?.name || "Visiteur"}
                    </span>
                    <span style={{ fontSize:12, color:"var(--gray-400)" }}>
                      {r.users?.email} · {new Date(r.created_at || r.createdAt).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })}
                    </span>
                  </div>

                  {/* Destination */}
                  <div style={{ fontSize:12, color:"var(--blue-600)", fontWeight:700, marginBottom:6 }}>
                    📍 {r.destinations?.name || "Destination supprimée"}
                  </div>

                  {/* Étoiles */}
                  <Stars rating={r.rating} />
                  <span style={{ fontSize:12, color:"var(--gray-400)", marginLeft:6 }}>{r.rating}/5</span>

                  {/* Commentaire */}
                  <p style={{ fontSize:14, color:"var(--gray-600)", lineHeight:1.7, margin:"8px 0 0", fontStyle:"italic", background:"var(--gray-50)", padding:"10px 14px", borderRadius:10, borderLeft:"3px solid var(--blue-500)" }}>
                    "{r.comment}"
                  </p>
                </div>
              </div>

              {/* Bouton supprimer */}
              <button
                onClick={() => setModal({ open:true, id:r.id || r._id })}
                style={{ background:"var(--red-l)", color:"var(--red)", border:"none", borderRadius:10, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", flexShrink:0 }}
              >
                🗑 Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={modal.open}
        title="Supprimer cet avis ?"
        message="Cet avis sera définitivement supprimé."
        confirmLabel="Oui, supprimer"
        confirmColor="var(--red)"
        onConfirm={handleDelete}
        onCancel={() => setModal({ open:false, id:null })}
      />
    </div>
  );
}