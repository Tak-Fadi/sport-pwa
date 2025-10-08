import { useEffect, useState } from "react";
import { postMeal, daySummary, listMeals, removeMeal } from "../api";

const todayStr = () => new Date().toISOString().slice(0,10);
const typeOptions = [
  { value:"breakfast", label:"Petit-déj" },
  { value:"lunch",     label:"Déjeuner" },
  { value:"dinner",    label:"Dîner" },
  { value:"snack",     label:"Collation" },
  { value:"other",     label:"Autre" },
];

export default function Journal(){
  const [userId] = useState(1);
  const [date, setDate] = useState(todayStr());
  const [form, setForm] = useState({ type:"lunch", kcal:"", protein:"", carbs:"", fat:"", note:"" });
  const [sum, setSum] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load(){
    setErr("");
    try {
      setSum(await daySummary(userId, date));
      setItems(await listMeals(userId, date));
    } catch(e){ setErr(String(e)); }
  }
  useEffect(()=>{ load(); }, [date]);

  async function onSubmit(e){
    e.preventDefault(); setLoading(true); setErr("");
    try {
      await postMeal({
        userId, date, type: form.type,
        kcal: +form.kcal || 0,
        protein: +form.protein || 0,
        carbs: +form.carbs || 0,
        fat: +form.fat || 0,
        note: form.note || ""
      });
      setForm({ type:"lunch", kcal:"", protein:"", carbs:"", fat:"", note:"" });
      await load();
    } catch(e){ setErr(String(e)); }
    finally { setLoading(false); }
  }

  async function onDelete(id){
    await removeMeal(userId, date, id);
    await load();
  }

  return (
    <>
      <div className="card">
        <div className="label">Date</div>
        <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
      </div>

      <div className="card">
        <h3>Ajouter un repas</h3>
        <form onSubmit={onSubmit} style={{display:"grid", gap:10}}>
          <select className="select" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <div className="row">
            <input className="input" placeholder="kcal" value={form.kcal} onChange={e=>setForm({...form, kcal:e.target.value})}/>
            <input className="input" placeholder="protéines (g)" value={form.protein} onChange={e=>setForm({...form, protein:e.target.value})}/>
          </div>
          <div className="row">
            <input className="input" placeholder="glucides (g)" value={form.carbs} onChange={e=>setForm({...form, carbs:e.target.value})}/>
            <input className="input" placeholder="lipides (g)" value={form.fat} onChange={e=>setForm({...form, fat:e.target.value})}/>
          </div>
          <input className="input" placeholder="note" value={form.note} onChange={e=>setForm({...form, note:e.target.value})}/>
          <button className="button" disabled={loading}>{loading?"Envoi...":"Enregistrer"}</button>
          {err && <div style={{color:"#ff6b6b"}}>{err}</div>}
        </form>
      </div>

      <div className="card">
        <h3>Totaux du jour</h3>
        {!sum ? <div className="label">—</div> : (
          <div className="list">
            <div><span className="label">kcal</span> {sum.totalKcal}</div>
            <div><span className="label">P</span> {sum.p} g</div>
            <div><span className="label">C</span> {sum.c} g</div>
            <div><span className="label">F</span> {sum.f} g</div>
          </div>
        )}
        {sum?.byType && (
          <div className="list" style={{marginTop:12}}>
            {typeOptions.map(t => {
              const s = sum.byType[t.value]; if(!s) return null;
              return (
                <div key={t.value} style={{opacity: (s.kcal??0)>0 ? 1 : 0.7}}>
                  <span className="label">{t.label}</span> {s.kcal||0} kcal — P{(s.p||0)}g / C{(s.c||0)}g / F{(s.f||0)}g
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Repas du jour</h3>
        <div className="list">
          {items.map(m => (
            <div key={m.id} className="card" style={{margin:0}}>
              <div className="label">{typeOptions.find(x=>x.value===m.type)?.label || "Autre"}</div>
              <div><b>{m.kcal||0} kcal</b> — P{m.protein||0} / C{m.carbs||0} / F{m.fat||0}</div>
              {m.note && <div className="label">{m.note}</div>}
              <button className="button" style={{marginTop:8, background:"#ef4444"}} onClick={()=>onDelete(m.id)}>Supprimer</button>
            </div>
          ))}
          {!items.length && <div className="label">Aucun repas pour cette date</div>}
        </div>
      </div>
    </>
  );
}
