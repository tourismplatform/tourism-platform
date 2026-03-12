"use client";
import { useState, useEffect } from "react";

import { adminAPI } from "@/lib/api";

export default function AdminUsers() {
  
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    adminAPI.getUsers()
      .then(d => { 
        setUsers(d.data || d.users || (Array.isArray(d) ? d : [])); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:"var(--font-title)", fontSize:28, color:"var(--gray-900)", margin:0 }}>
          Utilisateurs inscrits
        </h2>
        <p style={{ color:"var(--gray-400)", fontSize:13, marginTop:4 }}>{users.length} compte(s) créé(s)</p>
      </div>

      {/* Barre de recherche */}
      <div style={{ position:"relative", maxWidth:400, marginBottom:24 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"var(--gray-400)" }}>
          🔍
        </span>
        <input
          className="input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          style={{ paddingLeft:42 }}
        />
      </div>

      {/* Tableau */}
      <div className="card" style={{ overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Utilisateur","Email","Rôle","Inscrit le"].map(h => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding:40, textAlign:"center", color:"var(--gray-400)" }}>
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : filtered.map((u, i) => (
              <tr key={u.id || u._id} style={{ background: i%2===0 ? "var(--white)" : "var(--gray-50)" }}>
                <td className="td">
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,var(--blue-600),var(--blue-800))", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"var(--white)", fontSize:14, flexShrink:0 }}>
                      {(u.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight:700, fontSize:14, color:"var(--gray-900)" }}>
                      {u.name || "Utilisateur"}
                    </span>
                  </div>
                </td>
                <td className="td" style={{ color:"var(--gray-600)", fontSize:13 }}>{u.email}</td>
                <td className="td">
                  <span style={{ fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:20, background: u.role==="ADMIN" ? "var(--red-l)" : "var(--blue-50)", color: u.role==="ADMIN" ? "var(--red)" : "var(--blue-700)" }}>
                    {u.role === "ADMIN" ? "👑 Admin" : "🧳 Touriste"}
                  </span>
                </td>
                <td className="td" style={{ color:"var(--gray-400)", fontSize:13 }}>
                  {new Date(u.created_at || u.createdAt).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}