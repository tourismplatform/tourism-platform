"use client";
import { useState, useEffect } from "react";

import { destinationsAPI, uploadImage } from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";

const REAL_IMAGES = {
  "Cascades de Karfiguéla":      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cascades_de_Karfiguela.jpg/640px-Cascades_de_Karfiguela.jpg",
  "Ruines de Loropéni":          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Loropeni-ruins.jpg/640px-Loropeni-ruins.jpg",
  "Ranch de Nazinga":            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Elephants_at_Nazinga.jpg/640px-Elephants_at_Nazinga.jpg",
  "Pic de Sindou":               "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sindou_peaks_%281%29.jpg/640px-Sindou_peaks_%281%29.jpg",
  "Caïmans sacrés de Sabou":     "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Crocodile_sacre_de_Sabou.jpg/640px-Crocodile_sacre_de_Sabou.jpg",
  "Dômes de Fabédougou":         "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Fabedougou_domes.jpg/640px-Fabedougou_domes.jpg",
  "Mare aux Hippopotames":       "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Hippopotamus_amphibius_in_Burkina_Faso.jpg/640px-Hippopotamus_amphibius_in_Burkina_Faso.jpg",
  "Grand Marché de Ouagadougou": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Grand_Marche_Ouagadougou.jpg/640px-Grand_Marche_Ouagadougou.jpg",
};

function getImg(name, images) {
  if (images && images.length > 0) return images[0];
  return REAL_IMAGES[name] || "https://images.unsplash.com/photo-1580746738099-1b1d621a3404?w=640&q=80";
}

const CATS  = ["NATURE", "HISTORY", "BEACH", "CIRCUIT"];
const empty = { name:"", description:"", location:"", category:"NATURE", price_per_person:"", capacity:"", images:[] };

export default function AdminDestinations() {
  
  const [dests, setDests]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [delModal, setDelModal]   = useState({ open:false, id:null });
  const [toast, setToast]         = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = () => {
    destinationsAPI.getAll()
      .then(d => { 
        setDests(d.data || d.destinations || (Array.isArray(d) ? d : [])); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  const openEdit = (d) => {
    setForm({ 
      name: d.name, 
      description: d.description, 
      location: d.location, 
      category: d.category, 
      price_per_person: d.price_per_person || d.price, 
      capacity: d.capacity, 
      images: d.images || [] 
    });
    setEditing(d.id || d._id);
    setShowForm(true);
  };

  const removeImg = (url) => {
    setForm(f => ({ ...f, images: f.images.filter(i => i !== url) }));
  };

  const handleSave = async () => {
    if (!form.name || !form.location || !form.price_per_person)
      return alert("Nom, lieu et prix sont obligatoires.");
    setSaving(true);
    try {
      const payload = { 
        ...form,
        price_per_person: Number(form.price_per_person),
        capacity: Number(form.capacity || 0)
      };
      
      if (!payload.images || payload.images.length === 0) {
        const ri = REAL_IMAGES[form.name];
        if (ri) payload.images = [ri];
      }
      
      editing
        ? await destinationsAPI.update(editing, payload)
        : await destinationsAPI.create(payload);
        
      showToast(editing ? "✅ Mise à jour !" : "✅ Destination créée !");
      setShowForm(false);
      load();
    } catch(e) { alert("Erreur : " + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await destinationsAPI.delete(delModal.id);
      showToast("🗑 Destination supprimée.");
      setDelModal({ open:false, id:null });
      load();
    } catch(e) { alert("Erreur : " + e.message); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, images: [...f.images, url] }));
    } catch(e) { alert("Erreur upload : " + e.message); }
    finally { setUploading(false); }
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
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, right:20, background:"var(--blue-900)", color:"var(--white)", padding:"12px 24px", borderRadius:12, zIndex:9999, fontWeight:700, fontSize:14, boxShadow:"var(--shadow-lg)" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, gap: 16, flexWrap: 'wrap', paddingTop: 'clamp(0px, 15vw, 40px)' }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-title)", fontSize:'clamp(1.5rem, 5vw, 28px)', color:"var(--gray-900)", margin:0 }}>
            Gestion des Destinations
          </h2>
          <p style={{ color:"var(--gray-400)", fontSize:13, marginTop:4 }}>{dests.length} destination(s)</p>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="btn-primary" style={{ flex: '1 1 auto', maxWidth: 'none', justifyContent: 'center' }}>
          + Ajouter une destination
        </button>
      </div>

      {/* Vue Tableau (Desktop) */}
      <div className="card desktop-only" style={{ overflow:"hidden", marginTop: 20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Destination</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Catégorie</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Prix</th>
              <th className="th" style={{ textAlign: 'left', padding: '12px 24px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dests.length === 0 ? (
              <tr><td colSpan={4} style={{ padding:40, textAlign:"center", color:"var(--gray-400)" }}>Aucune destination.</td></tr>
            ) : dests.map((d, i) => (
              <tr key={d.id || d._id} style={{ borderBottom: '1px solid var(--gray-50)' }}>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <img
                      src={getImg(d.name, d.images)}
                      alt={d.name}
                      style={{ width:52, height:44, objectFit:"cover", borderRadius:8, flexShrink:0 }}
                      onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1580746738099-1b1d621a3404?w=200&q=60"; }}
                    />
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:"var(--gray-900)" }}>{d.name}</div>
                      <div style={{ fontSize:11, color:"var(--gray-400)" }}>📍 {d.location}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 24px' }}>
                  <span style={{ background:"var(--blue-50)", color:"var(--blue-700)", border:"1px solid var(--blue-100)", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:600 }}>
                    {d.category}
                  </span>
                </td>
                <td style={{ padding: '12px 24px', fontWeight:700, color:"var(--blue-700)", fontSize: 13 }}>
                  {d.price_per_person > 0 ? Number(d.price_per_person).toLocaleString("fr-FR") + " F" : "Gratuit"}
                </td>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => openEdit(d)} style={{ background:"var(--blue-50)", color:"var(--blue-700)", border:"none", borderRadius:8, padding:"8px 14px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      ✏️ Modifier
                    </button>
                    <button onClick={() => setDelModal({ open:true, id:d.id || d._id })} style={{ background:"var(--red-l)", color:"var(--red)", border:"none", borderRadius:8, padding:"8px 14px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      🗑 Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue Cartes (Mobile) */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {dests.length === 0 ? (
          <div className="card" style={{ padding:40, textAlign:"center", color:"var(--gray-400)" }}>Aucune destination.</div>
        ) : dests.map((d) => (
          <div key={d.id || d._id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <img
                src={getImg(d.name, d.images)}
                alt={d.name}
                style={{ width: 80, height: 70, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1580746738099-1b1d621a3404?w=200&q=60"; }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "var(--gray-900)", marginBottom: 4 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 8 }}>📍 {d.location}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background:"var(--blue-50)", color:"var(--blue-700)", border:"1px solid var(--blue-100)", borderRadius:20, padding:"2px 10px", fontSize:10, fontWeight:700 }}>
                    {d.category}
                  </span>
                  <div style={{ fontWeight: 800, color: "var(--blue-700)", fontSize: 14 }}>
                    {d.price_per_person > 0 ? Number(d.price_per_person).toLocaleString("fr-FR") + " F" : "Gratuit"}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: 10, borderTop: '1px solid var(--gray-50)', paddingTop: 12 }}>
              <button 
                onClick={() => openEdit(d)} 
                style={{ background: "var(--blue-600)", color: "white", border: "none", borderRadius: 8, padding: "10px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                ✏️ Modifier
              </button>
              <button 
                onClick={() => setDelModal({ open: true, id: d.id || d._id })} 
                style={{ background: "var(--red-l)", color: "var(--red)", border: "none", borderRadius: 8, padding: "10px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                🗑 Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(10,22,40,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(4px)", padding:20 }}>
          <div style={{ background:"var(--white)", borderRadius:18, padding:36, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", boxShadow:"var(--shadow-lg)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h3 style={{ fontFamily:"var(--font-title)", fontSize:22, color:"var(--gray-900)", margin:0 }}>
                {editing ? "Modifier la destination" : "Nouvelle destination"}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background:"var(--gray-100)", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16, color:"var(--gray-600)" }}>✕</button>
            </div>

            {[
              ["Nom *",          "text",   "name",             "Ex: Cascades de Karfiguéla"],
              ["Localisation *", "text",   "location",         "Ex: Banfora, Cascades"],
              ["Prix (FCFA) *",  "number", "price_per_person", "Ex: 15000"],
              ["Capacité max",   "number", "capacity",         "Ex: 50"],
            ].map(([label, type, key, ph]) => (
              <div key={key} style={{ marginBottom:16 }}>
                <label className="label">{label}</label>
                <input className="input" type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} />
              </div>
            ))}

            <div style={{ marginBottom:16 }}>
              <label className="label">Description</label>
              <textarea className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Décrivez la destination..." style={{ height:80, resize:"none" }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <label className="label">Catégorie</label>
              <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:20 }}>
              <label className="label">Photos ({form.images.length})</label>
              
              {/* Galerie d'aperçu */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(80px, 1fr))", gap:8, marginBottom:12 }}>
                {form.images.map((url, i) => (
                  <div key={i} style={{ position:"relative", aspectRatio:"1/1", borderRadius:8, overflow:"hidden", border:"1px solid var(--gray-200)" }}>
                    <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <button 
                      onClick={() => removeImg(url)}
                      style={{ position:"absolute", top:2, right:2, width:20, height:20, borderRadius:"50%", background:"rgba(255,0,0,0.8)", color:"white", border:"none", cursor:"pointer", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"var(--blue-50)", border:"1.5px dashed var(--blue-400)", borderRadius:10, cursor:"pointer", aspectRatio:"1/1", transition:"all 0.2s" }}>
                  <span style={{ fontSize:20, color:"var(--blue-700)" }}>{uploading ? "⏳" : "+"}</span>
                  <input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }} disabled={uploading} />
                </label>
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ flex:1, justifyContent:"center" }}>Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex:2, justifyContent:"center", opacity:saving?0.6:1 }}>
                {saving ? "Enregistrement..." : editing ? "💾 Mettre à jour" : "✅ Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={delModal.open}
        title="Supprimer cette destination ?"
        message="Cette action est irréversible."
        confirmLabel="Oui, supprimer"
        confirmColor="var(--red)"
        onConfirm={handleDelete}
        onCancel={() => setDelModal({ open:false, id:null })}
      />
    </div>
  );
}