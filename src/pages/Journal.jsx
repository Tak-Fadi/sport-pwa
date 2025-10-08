import { useEffect, useState } from "react";
import { postMeal, daySummary } from "../api";

const todayStr = () => new Date().toISOString().slice(0,10);

export default function Journal(){
  const [userId] = useState(1);
  const [date, setDate] = useState(todayStr());
  const [form, setForm] = useState({ kcal:"", protein:"", carbs:"", fat:"", note:"" });
  const [sum, setSum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load(){
    try { setSum(await daySummary(userId, date)); }
    catch(e){ setErr(String(e)); }
  }
  useEffect(()=>{ load(); }, [date]);

  async function onSubmit(e){
    e.preventDefault(); setLoading(true); setErr("");
    try {
      await postMeal({
        userId, date,
        kcal: +form.kcal || 0, protein: +form.protein || 0,
        carbs: +form.carbs || 0, fat: +form.fat || 0, note: form.note || ""
      });
      setForm({kcal:"", protein:"", carbs:"", fat:"", note:""}); await load();
    } catch(e){ setErr(String(e)); }
    finally { setLoading(false); }
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
      </div>
    </>
  );
}
