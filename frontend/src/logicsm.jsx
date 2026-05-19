import { useState } from "react";

let uid = 100;
const newId = () => ++uid;

// ── Seed data ──────────────────────────────────────────────
const seed = [
  {
    id: 1, name: "Web Development",
    names: [
      { id: 2, label: "Frontend", subnames: [{ id: 3, label: "React" }, { id: 4, label: "Vue" }] },
      { id: 5, label: "Backend",  subnames: [{ id: 6, label: "Node.js" }, { id: 7, label: "Django" }] },
    ],
  },
  {
    id: 8, name: "Design",
    names: [
      { id: 9, label: "UI Design", subnames: [{ id: 10, label: "Figma" }, { id: 11, label: "Adobe XD" }] },
    ],
  },
];

// ── Tiny helpers ───────────────────────────────────────────
const ACCENT = "#f97316";
const ACCENT2 = "#fb923c";
const BG     = "#0c0d0f";
const CARD   = "#131518";
const BORDER = "#1f2226";

function Pill({ children, onRemove, color = ACCENT }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: color + "18", border: `1px solid ${color}35`,
      color, borderRadius: 99, padding: "3px 10px 3px 12px",
      fontSize: 12, fontWeight: 600, letterSpacing: .3,
    }}>
      {children}
      {onRemove && (
        <button onClick={onRemove} style={{
          background: "none", border: "none", cursor: "pointer",
          color, opacity: .6, fontSize: 14, lineHeight: 1,
          padding: 0, display: "flex", alignItems: "center",
        }}>×</button>
      )}
    </span>
  );
}

function InlineAdd({ placeholder, onAdd, accent = ACCENT }) {
  const [val, setVal] = useState("");
  const commit = () => {
    if (val.trim()) { onAdd(val.trim()); setVal(""); }
  };
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === "Enter" && commit()}
        placeholder={placeholder}
        style={{
          flex: 1, background: "#1a1c20", border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: "7px 12px", color: "#e2e8f0",
          fontSize: 13, fontFamily: "inherit", outline: "none",
        }}
      />
      <button onClick={commit} style={{
        background: accent, border: "none", borderRadius: 8,
        color: "#fff", fontWeight: 700, fontSize: 13,
        padding: "7px 16px", cursor: "pointer", fontFamily: "inherit",
        opacity: val.trim() ? 1 : .4, transition: "opacity .15s",
      }}>Add</button>
    </div>
  );
}

// ── Subname list inside a Name ─────────────────────────────
function SubnameBlock({ subnames, onAdd, onRemove }) {
  return (
    <div style={{ marginTop: 10, paddingLeft: 4 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1.4,
        color: "#4b5563", textTransform: "uppercase", marginBottom: 6,
      }}>Subnames</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {subnames.map(s => (
          <Pill key={s.id} color="#22d3ee" onRemove={() => onRemove(s.id)}>
            {s.label}
          </Pill>
        ))}
      </div>
      <InlineAdd placeholder="Add subname…" onAdd={onAdd} accent="#22d3ee" />
    </div>
  );
}

// ── Name row inside a Service ──────────────────────────────
function NameRow({ name, onRemoveName, onAddSubname, onRemoveSubname }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "#17191e", border: `1px solid ${BORDER}`,
      borderRadius: 10, overflow: "hidden", marginTop: 8,
    }}>
      {/* header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span style={{
          fontSize: 11, color: open ? ACCENT2 : "#4b5563",
          transition: "color .15s", transform: open ? "rotate(90deg)" : "none",
          display: "inline-block", transition: "transform .2s, color .15s",
          fontWeight: 800,
        }}>▶</span>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#cbd5e1", flex: 1 }}>{name.label}</span>
        <Pill color="#a78bfa">{name.subnames.length} sub</Pill>
        <button
          onClick={e => { e.stopPropagation(); onRemoveName(); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#4b5563", fontSize: 18, lineHeight: 1, padding: "0 2px",
          }}
        >×</button>
      </div>
      {/* body */}
      {open && (
        <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${BORDER}` }}>
          <SubnameBlock
            subnames={name.subnames}
            onAdd={onAddSubname}
            onRemove={onRemoveSubname}
          />
        </div>
      )}
    </div>
  );
}

// ── Service card ───────────────────────────────────────────
function ServiceCard({ service, onRemove, onChange }) {
  const [open, setOpen]   = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(service.name);

  const totalSubs = service.names.reduce((a, n) => a + n.subnames.length, 0);

  function addName(label) {
    onChange({ ...service, names: [...service.names, { id: newId(), label, subnames: [] }] });
  }
  function removeName(nid) {
    onChange({ ...service, names: service.names.filter(n => n.id !== nid) });
  }
  function addSubname(nid, label) {
    onChange({
      ...service,
      names: service.names.map(n =>
        n.id === nid ? { ...n, subnames: [...n.subnames, { id: newId(), label }] } : n
      ),
    });
  }
  function removeSubname(nid, sid) {
    onChange({
      ...service,
      names: service.names.map(n =>
        n.id === nid ? { ...n, subnames: n.subnames.filter(s => s.id !== sid) } : n
      ),
    });
  }
  function commitEdit() {
    if (editVal.trim()) onChange({ ...service, name: editVal.trim() });
    setEditing(false);
  }

  return (
    <div style={{
      background: CARD, border: `1.5px solid ${open ? ACCENT + "55" : BORDER}`,
      borderRadius: 14, overflow: "hidden",
      transition: "border-color .2s",
      boxShadow: open ? `0 0 0 1px ${ACCENT}22` : "none",
    }}>
      {/* Service header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
        cursor: "pointer", background: open ? "#16181d" : "transparent",
        transition: "background .18s",
      }} onClick={() => !editing && setOpen(o => !o)}>
        {/* colored dot */}
        <div style={{
          width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
          background: open ? ACCENT : "#2d3142",
          boxShadow: open ? `0 0 8px ${ACCENT}99` : "none",
          transition: "all .2s",
        }} />

        {editing ? (
          <input
            autoFocus
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(false); }}
            onBlur={commitEdit}
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, background: "#1f2226", border: `1px solid ${ACCENT}`,
              borderRadius: 6, padding: "4px 10px", color: "#fff",
              fontSize: 16, fontFamily: "inherit", outline: "none", fontWeight: 700,
            }}
          />
        ) : (
          <span style={{
            flex: 1, fontFamily: "'Sora',sans-serif", fontWeight: 700,
            fontSize: 16, color: "#f1f5f9", letterSpacing: -.2,
          }}>{service.name}</span>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Pill color={ACCENT}>{service.names.length} names</Pill>
          <Pill color="#64748b">{totalSubs} subs</Pill>
          <button
            onClick={e => { e.stopPropagation(); setEditing(true); setEditVal(service.name); }}
            title="Rename"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: 15, padding: "0 3px" }}
          >✎</button>
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            title="Delete service"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: 18, padding: "0 3px" }}
          >×</button>
          <span style={{
            fontSize: 12, color: open ? ACCENT : "#4b5563",
            transform: open ? "rotate(180deg)" : "none",
            display: "inline-block", transition: "transform .2s, color .18s",
          }}>▼</span>
        </div>
      </div>

      {/* Expanded body */}
      {open && (
        <div style={{ padding: "4px 20px 20px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 1.4,
            color: "#4b5563", textTransform: "uppercase", marginTop: 14, marginBottom: 2,
          }}>Names</div>

          {service.names.map(n => (
            <NameRow
              key={n.id}
              name={n}
              onRemoveName={() => removeName(n.id)}
              onAddSubname={label => addSubname(n.id, label)}
              onRemoveSubname={sid => removeSubname(n.id, sid)}
            />
          ))}

          <InlineAdd placeholder="Add name to this service…" onAdd={addName} accent={ACCENT} />
        </div>
      )}
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────
export default function App() {
  const [services, setServices] = useState(seed);
  const [newSvc, setNewSvc]     = useState("");

  function addService() {
    if (!newSvc.trim()) return;
    setServices(s => [...s, { id: newId(), name: newSvc.trim(), names: [] }]);
    setNewSvc("");
  }

  function removeService(id) {
    setServices(s => s.filter(x => x.id !== id));
  }

  function updateService(updated) {
    setServices(s => s.map(x => x.id === updated.id ? updated : x));
  }

  const totalNames = services.reduce((a, s) => a + s.names.length, 0);
  const totalSubs  = services.reduce((a, s) =>
    a + s.names.reduce((b, n) => b + n.subnames.length, 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #131518; }
        ::-webkit-scrollbar-thumb { background: #2d3142; border-radius: 99px; }
        input::placeholder { color: #374151; }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 16px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: ACCENT + "18", border: `1px solid ${ACCENT}30`,
            borderRadius: 99, padding: "4px 14px", marginBottom: 14,
            fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.2, textTransform: "uppercase",
          }}>
            ◈ Service Manager
          </div>
          <h1 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 32,
            color: "#f8fafc", letterSpacing: -1, lineHeight: 1.15, marginBottom: 8,
          }}>
            3-Level Hierarchy
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
            Each <span style={{ color: ACCENT }}>Service</span> holds multiple{" "}
            <span style={{ color: "#a78bfa" }}>Names</span>, and every Name holds multiple{" "}
            <span style={{ color: "#22d3ee" }}>Subnames</span>.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {[
              { label: "Services", val: services.length, color: ACCENT },
              { label: "Names",    val: totalNames,       color: "#a78bfa" },
              { label: "Subnames", val: totalSubs,        color: "#22d3ee" },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, background: CARD, border: `1px solid ${BORDER}`,
                borderRadius: 12, padding: "12px 16px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 1.2 }}>{s.label}</div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, color: s.color, marginTop: 2 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Service */}
        <div style={{
          background: CARD, border: `1.5px solid ${BORDER}`,
          borderRadius: 14, padding: "18px 20px", marginBottom: 24,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
            color: "#4b5563", textTransform: "uppercase", marginBottom: 10,
          }}>New Service</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={newSvc}
              onChange={e => setNewSvc(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addService()}
              placeholder="Service name…"
              style={{
                flex: 1, background: "#1a1c20", border: `1px solid ${BORDER}`,
                borderRadius: 10, padding: "10px 14px", color: "#e2e8f0",
                fontSize: 15, fontFamily: "inherit", outline: "none",
              }}
            />
            <button onClick={addService} style={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              border: "none", borderRadius: 10, color: "#fff",
              fontWeight: 700, fontSize: 14, padding: "10px 22px",
              cursor: "pointer", fontFamily: "inherit",
              opacity: newSvc.trim() ? 1 : .45, transition: "opacity .15s",
            }}>+ Add</button>
          </div>
        </div>

        {/* Service list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {services.length === 0 && (
            <div style={{
              textAlign: "center", padding: "48px 0",
              color: "#374151", fontSize: 14,
            }}>No services yet — add one above.</div>
          )}
          {services.map(s => (
            <ServiceCard
              key={s.id}
              service={s}
              onRemove={() => removeService(s.id)}
              onChange={updateService}
            />
          ))}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: 40, display: "flex", gap: 20, justifyContent: "center",
          fontSize: 12, color: "#374151",
        }}>
          {[
            { color: ACCENT,    label: "Service" },
            { color: "#a78bfa", label: "Name" },
            { color: "#22d3ee", label: "Subname" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
