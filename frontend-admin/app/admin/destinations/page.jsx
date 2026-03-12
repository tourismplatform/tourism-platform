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
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-title)", fontSize:28, color:"var(--gray-900)", margin:0 }}>
            Gestion des Destinations
          </h2>
          <p style={{ color:"var(--gray-400)", fontSize:13, marginTop:4 }}>{dests.length} destination(s)</p>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="btn-primary">
          + Ajouter une destination
        </button>
      </div>

      {/* Tableau */}
      <div className="card" style={{ overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Destination","Catégorie","Prix","Actions"].map(h => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dests.length === 0 ? (
              <tr><td colSpan={4} style={{ padding:40, textAlign:"center", color:"var(--gray-400)" }}>Aucune destination.</td></tr>
            ) : dests.map((d, i) => (
              <tr key={d.id || d._id} style={{ background: i%2===0 ? "var(--white)" : "var(--gray-50)" }}>
                <td className="td">
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <img
                      src={getImg(d.name, d.images)}
                      alt={d.name}
                      style={{ width:52, height:44, objectFit:"cover", borderRadius:8, flexShrink:0 }}
                      onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1580746738099-1b1d621a3404?w=200&q=60"; }}
                    />
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"var(--gray-900)" }}>{d.name}</div>
                      <div style={{ fontSize:12, color:"var(--gray-400)" }}>📍 {d.location}</div>
                    </div>
                  </div>
                </td>
                <td className="td">
                  <span style={{ background:"var(--blue-50)", color:"var(--blue-700)", border:"1px solid var(--blue-100)", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:600 }}>
                    {d.category}
                  </span>
                </td>
                <td className="td" style={{ fontWeight:700, color:"var(--blue-700)" }}>
                  {d.price_per_person > 0 ? Number(d.price_per_person).toLocaleString("fr-FR") + " FCFA" : "Gratuit"}
                </td>
                <td className="td">
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => openEdit(d)} style={{ background:"var(--blue-50)", color:"var(--blue-700)", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>
                      ✏️ Modifier
                    </button>
                    <button onClick={() => setDelModal({ open:true, id:d.id || d._id })} style={{ background:"var(--red-l)", color:"var(--red)", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>
                      🗑 Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <label className="label">Photo</label>
              <label style={{ display:"inline-block", padding:"9px 18px", background:"var(--blue-50)", border:"1.5px dashed var(--blue-400)", borderRadius:10, cursor:"pointer", fontSize:13, color:"var(--blue-700)", fontWeight:600 }}>
                {uploading ? "⏳ Upload en cours..." : "📷 Ajouter une photo"}
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }} />
              </label>
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