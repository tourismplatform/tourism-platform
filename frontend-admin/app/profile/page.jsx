"use client";
import { useState, useEffect } from "react";
import { useAuth,  } from "@/lib/AuthContext";
import { authAPI, usersAPI } from "@/lib/api";

export default function ProfilePage() {
 
  const { user, login } = useAuth();
  const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  useEffect(() => {
    authAPI.me()
      .then(d => {
        setForm(f => ({ ...f, name: d.user.name, email: d.user.email }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError(""); setSuccess("");
    if (form.password && form.password !== form.confirm)
      return setError("Les mots de passe ne correspondent pas.");
    const body = { name: form.name, email: form.email };
    if (form.password) body.password = form.password;
    setSaving(true);
    try {
      const d = await usersAPI.updateMe(user._id, body);
      login(d.user, localStorage.getItem("token"));
      setSuccess("Profil mis à jour avec succès !");
      setForm(f => ({ ...f, password:"", confirm:"" }));
    } catch(e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"60vh", color:"var(--gray-400)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
        Chargement...
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--gray-50)" }}>

      {/* Header */}
      <div className="page-header">
        <div className="label">Mon espace</div>
        <h1>Mon Profil</h1>
      </div>

      <div style={{ maxWidth:620, margin:"40px auto", padding:"0 24px" }}>

        {/* Avatar */}
        <div className="card" style={{ padding:32, marginBottom:24, display:"flex", alignItems:"center", gap:20 }}>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"linear-gradient(135deg,var(--blue-600),var(--blue-800))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, fontWeight:800, color:"var(--white)", flexShrink:0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-title)", fontSize:22, color:"var(--gray-900)", marginBottom:4 }}>
              {user?.name}
            </div>
            <div style={{ fontSize:13, color:"var(--gray-400)" }}>🧳 Touriste</div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="card" style={{ padding:32 }}>
          <h2 style={{ fontFamily:"var(--font-title)", fontSize:20, color:"var(--gray-900)", margin:"0 0 24px" }}>
            Modifier mes informations
          </h2>

          {success && <div className="alert-success" style={{ marginBottom:16 }}>✅ {success}</div>}
          {error   && <div className="alert-error"   style={{ marginBottom:16 }}>❌ {error}</div>}

          {[
            ["Nom complet",           "text",     form.name,     "name",     "Votre nom complet"],
            ["Adresse email",         "email",    form.email,    "email",    "votre@email.com"],
            ["Nouveau mot de passe",  "password", form.password, "password", "••••••••"],
            ["Confirmer mot de passe","password", form.confirm,  "confirm",  "••••••••"],
          ].map(([label, type, val, key, ph]) => (
            <div key={key} style={{ marginBottom:16 }}>
              <label className="label">{label}</label>
              <input
                className="input"
                type={type}
                value={val}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={ph}
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{ width:"100%", justifyContent:"center", marginTop:8, opacity:saving?0.6:1 }}
          >
            {saving ? "Enregistrement..." : "💾 Enregistrer les modifications"}
          </button>
        </div>

      </div>
    </div>
  );
}