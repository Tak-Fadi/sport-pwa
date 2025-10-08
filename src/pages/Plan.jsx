import { useEffect, useMemo, useState } from "react";
import { addPlan, getPlan } from "../api";
import { Card, Input, Select, Button, Pill } from "../components/ui";

// Jours (lundi = 0 pour être cohérent avec la partie semaine)
const WEEKDAYS = [
  { v:0, label:"Lundi" },
  { v:1, label:"Mardi" },
  { v:2, label:"Mercredi" },
  { v:3, label:"Jeudi" },
  { v:4, label:"Vendredi" },
  { v:5, label:"Samedi" },
  { v:6, label:"Dimanche" },
];

const TYPES = [
  "Cardio", "Force", "HIIT", "Pliométrie", "Mobilité", "Repos", "Autre"
];

export default function Plan(){
  const [userId] = useState(1);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ weekday: 0, type: "Cardio", targetDurationMin: 30, notes: "" });

  async function load(){
    const list = await getPlan(userId);
    setItems(list || []);
  }
  useEffect(()=>{ load(); }, []);

  const grouped = useMemo(()=>{
    const g = new Map();
    for (const d of WEEKDAYS) g.set(d.v, []);
    for (const it of items) {
      const w = (typeof it.weekday === "number" ? it.weekday : 0);
      if(!g.has(w)) g.set(w, []);
      g.get(w).push(it);
    }
    return g;
  }, [items]);

  async function submit(e){
    e.preventDefault();
    await addPlan({ userId, weekday: +form.weekday, type: form.type, targetDurationMin: +form.targetDurationMin || 0, notes: form.notes || "" });
    setForm({ weekday: form.weekday, type: form.type, targetDurationMin: 30, notes: "" });
    await load();
  }

  return (
    <>
      <Card title="Ajouter une séance">
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Select value={form.weekday} onChange={e=>setForm({...form, weekday: +e.target.value})}>
              {WEEKDAYS.map(d => <option key={d.v} value={d.v}>{d.label}</option>)}
            </Select>
            <Select value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Durée (min)" value={form.targetDurationMin}
                   onChange={e=>setForm({...form, targetDurationMin: e.target.value})}/>
            <Input placeholder="Notes (optionnel)" value={form.notes}
                   onChange={e=>setForm({...form, notes: e.target.value})}/>
          </div>
          <Button>Ajouter</Button>
        </form>
      </Card>

      <Card title="Planning hebdo">
        <div className="space-y-3">
          {WEEKDAYS.map(d => {
            const list = grouped.get(d.v) || [];
            return (
              <div key={d.v} className="glass rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{d.label}</div>
                  <Pill>{list.length} séance{list.length>1?"s":""}</Pill>
                </div>
                {list.length === 0 ? (
                  <div className="text-white/60 text-sm">—</div>
                ) : (
                  <div className="grid gap-2">
                  {list.map(it => (
                    <div key={it.id} className="glass rounded-xl p-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{it.type || "Séance"}</div>
                        <div className="flex items-center gap-2">
                          {typeof it.targetDurationMin === "number" && it.targetDurationMin > 0 && (
                            <div className="text-white/70 text-sm">{it.targetDurationMin} min</div>
                          )}
                          <button
                            className="tap text-[13px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10"
                            onClick={async ()=>{ 
                              const { removePlan } = await import("../api");
                              await removePlan(userId, it.id);
                              await load();
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                      {it.notes && <div className="text-white/70 text-sm mt-1">{it.notes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
          })}
        </div>
      </Card>
    </>
  );
}
