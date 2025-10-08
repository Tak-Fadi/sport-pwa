import { useEffect, useState } from "react";
import { addPlan, getPlan } from "../api";

const weekOptions = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

export default function Plan(){
  const [userId] = useState(1);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ weekday:"Lundi", type:"Cardio", targetDurationMin:"60", notes:"" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(){ setItems(await getPlan(userId)); }
  useEffect(()=>{ load(); }, []);

  async function onSubmit(e){
    e.preventDefault(); setLoading(true); setErr("");
    try {
      await addPlan({
        userId,
        weekday: form.weekday,
        type: form.type,
        targetDurationMin: +form.targetDurationMin || 0,
        notes: form.notes
      });
      setForm({ weekday:"MONDAY", type:"Cardio", targetDurationMin:"60", notes:"" });
      await load();
    } catch(e){ setErr(String(e)); }
    finally { setLoading(false); }
  }

  return (
    <>
      <div className="card">
        <h3>Ajouter un jour d’entraînement</h3>
        <form onSubmit={onSubmit} style={{display:"grid", gap:10}}>
          <select className="select" value={form.weekday} onChange={e=>setForm({...form, weekday:e.target.value})}>
            {weekOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input className="input" placeholder="Type (Force, Cardio, Repos…)" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}/>
          <input className="input" placeholder="Durée cible (min)" value={form.targetDurationMin} onChange={e=>setForm({...form, targetDurationMin:e.target.value})}/>
          <input className="input" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
          <button className="button" disabled={loading}>{loading?"Ajout...":"Ajouter"}</button>
          {err && <div style={{color:"#ff6b6b"}}>{err}</div>}
        </form>
      </div>

      <div className="card">
        <h3>Planning (L→D)</h3>
        <div className="list">
          {items.map(it =>
            <div key={it.id} className="card" style={{margin:0}}>
              <div className="label">{it.weekday}</div>
              <div><b>{it.type}</b> — {it.targetDurationMin||0} min</div>
              {it.notes && <div className="label">{it.notes}</div>}
            </div>
          )}
          {!items.length && <div className="label">Commence par ajouter un jour 👆</div>}
        </div>
      </div>
    </>
  );
}
