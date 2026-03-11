"use client";
import { useState, useEffect } from "react";

import { bookingsAPI, reviewsAPI } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default function MyBookingsPage() {
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [reviews, setReviews]   = useState({});

  useEffect(() => {
    bookingsAPI.getMine()
      .then(d => { setBookings(d.bookings || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const setRev = (id, field, val) =>
    setReviews(r => ({ ...r, [id]: { ...r[id], [field]: val } }));

  const submitReview = async (b) => {
    const rev = reviews[b._id] || {};
    if (!rev.rating || !rev.comment)
      return alert("Remplissez la note et le commentaire.");
    try {
      await reviewsAPI.create({
        destinationId: b.destinationId?._id || b.destinationId,
        bookingId:     b._id,
        rating:        rev.rating,
        comment:       rev.comment,
      });
      setReviews(r => ({ ...r, [b._id]: { ...r[b._id], submitted: true } }));
    } catch(e) { alert("Erreur : " + e.message); }
  };

  const canReview = (b) =>
    b.status === "confirmed" && new Date(b.dates?.start || b.date) < new Date();

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"60vh", color:"var(--gray-400)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
        Chargement de vos réservations...
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--gray-50)" }}>

      {/* Header */}
      <div className="page-header">
        <div className="label">Mon espace</div>
        <h1>Mes Réservations</h1>
        <p style={{ color:"var(--blue-400)", marginTop:8, fontSize:14 }}>
          {bookings.length} réservation(s) au total
        </p>
      </div>

      <div style={{ maxWidth:860, margin:"40px auto", padding:"0 24px" }}>

        {bookings.length === 0 ? (
          <div className="card" style={{ padding:80, textAlign:"center" }}>
            <div style={{ fontSize:60, marginBottom:16 }}>📅</div>
            <div style={{ fontFamily:"var(--font-title)", fontSize:22, color:"var(--gray-900)", marginBottom:8 }}>
              Aucune réservation
            </div>
            <div style={{ color:"var(--gray-400)", fontSize:14 }}>
              Vous n'avez pas encore réservé de destination.
            </div>
          </div>
        ) : bookings.map(b => {
          const rev = reviews[b._id] || {};
          return (
            <div key={b._id} className="card" style={{ marginBottom:20, overflow:"hidden" }}>

              {/* Header réservation */}
              <div style={{ padding:"22px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid var(--gray-100)" }}>
                <div>
                  <div style={{ fontFamily:"var(--font-title)", fontSize:18, color:"var(--gray-900)", marginBottom:4 }}>
                    {b.destinationId?.name || "Destination"}
                  </div>
                  <div style={{ fontSize:12, color:"var(--gray-400)" }}>
                    📍 {b.destinationId?.location}
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>

              {/* Détails */}
              <div style={{ padding:"20px 28px", display:"flex", gap:16, flexWrap:"wrap" }}>
                {[
                  ["📅", "Date",      new Date(b.dates?.start || b.date).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })],
                  ["👥", "Personnes", b.persons + " pers."],
                  ["💰", "Total",     Number(b.totalPrice || 0).toLocaleString("fr-FR") + " FCFA"],
                  ["🔖", "Référence", "#" + b._id?.slice(-6).toUpperCase()],
                ].map(([icon, label, value]) => (
                  <div key={label} style={{ background:"var(--gray-50)", borderRadius:10, padding:"12px 18px", minWidth:140, border:"1px solid var(--gray-200)" }}>
                    <div style={{ fontSize:18, marginBottom:4 }}>{icon}</div>
                    <div style={{ fontSize:11, color:"var(--gray-400)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--gray-900)" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Avis soumis */}
              {rev.submitted && (
                <div style={{ padding:"14px 28px", background:"var(--green-l)", borderTop:"1px solid var(--gray-100)", fontSize:14, fontWeight:600, color:"var(--green)" }}>
                  ✅ Merci ! Votre avis a été publié.
                </div>
              )}

              {/* Formulaire avis */}
              {canReview(b) && !rev.submitted && !b.hasReviewed && (
                <div style={{ padding:"24px 28px", background:"var(--blue-50)", borderTop:"2px solid var(--blue-100)" }}>
                  <div style={{ fontFamily:"var(--font-title)", fontSize:17, color:"var(--blue-900)", marginBottom:16 }}>
                    ✍️ Partagez votre expérience
                  </div>

                  {/* Étoiles */}
                  <div style={{ marginBottom:14 }}>
                    <label className="label">Note *</label>
                    <div style={{ display:"flex", gap:4 }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setRev(b._id, "rating", n)}
                          style={{ fontSize:28, background:"none", border:"none", cursor:"pointer", color:(rev.rating||0)>=n?"var(--blue-600)":"var(--gray-200)", padding:0 }}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Commentaire */}
                  <div style={{ marginBottom:16 }}>
                    <label className="label">Commentaire *</label>
                    <textarea
                      className="input"
                      value={rev.comment || ""}
                      onChange={e => setRev(b._id, "comment", e.target.value)}
                      placeholder="Décrivez votre expérience..."
                      style={{ height:90, resize:"none" }}
                    />
                  </div>

                  <button onClick={() => submitReview(b)} className="btn-primary">
                    Publier mon avis ★
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}