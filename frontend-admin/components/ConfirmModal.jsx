"use client";

export default function ConfirmModal({
  isOpen,
  title        = "Confirmer",
  message      = "Êtes-vous sûr ?",
  confirmLabel = "Confirmer",
  cancelLabel  = "Annuler",
  confirmColor = "var(--blue-600)",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(10,22,40,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, backdropFilter: "blur(4px)", padding: 20,
    }}>
      <div style={{
        background: "var(--white)", borderRadius: 16,
        padding: "36px 40px", maxWidth: 420, width: "100%",
        boxShadow: "var(--shadow-lg)",
      }}>
        <div style={{ fontSize:44, textAlign:"center", marginBottom:16 }}>⚠️</div>
        <h3 style={{ fontFamily:"var(--font-title)", fontSize:22, color:"var(--gray-900)", textAlign:"center", margin:"0 0 10px" }}>
          {title}
        </h3>
        <p style={{ fontSize:14, color:"var(--gray-600)", textAlign:"center", lineHeight:1.7, margin:"0 0 28px" }}>
          {message}
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={onCancel} style={{
            flex:1, padding:"12px", borderRadius:10,
            border:"1.5px solid var(--gray-200)",
            background:"var(--gray-50)", color:"var(--gray-700)",
            fontSize:14, fontWeight:600, cursor:"pointer",
            fontFamily:"var(--font-body)",
          }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} style={{
            flex:1, padding:"12px", borderRadius:10,
            border:"none", background:confirmColor,
            color:"#fff", fontSize:14, fontWeight:700,
            cursor:"pointer", fontFamily:"var(--font-body)",
          }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}