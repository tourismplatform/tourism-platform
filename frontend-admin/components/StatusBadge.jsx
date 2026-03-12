"use client";

const CONFIG = {
  pending:   { label:"En attente", bg:"var(--yellow-l)", color:"var(--yellow)", dot:"#ca8a04" },
  confirmed: { label:"Confirmée",  bg:"var(--green-l)",  color:"var(--green)",  dot:"#16a34a" },
  cancelled: { label:"Annulée",    bg:"var(--red-l)",    color:"var(--red)",    dot:"#dc2626" },
};

export default function StatusBadge({ status }) {
  const c = CONFIG[status] || {
    label: status,
    bg: "var(--gray-100)",
    color: "var(--gray-600)",
    dot: "var(--gray-400)",
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: c.bg, color: c.color,
      border: `1px solid ${c.color}33`,
      borderRadius: 20, padding: "4px 12px",
      fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {c.label}
    </span>
  );
}