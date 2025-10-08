import { useEffect, useMemo, useState } from "react";
import { weekSummary } from "../api";

const todayStr = () => new Date().toISOString().slice(0,10);
const dayNames = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

export default function Week(){
  const [userId] = useState(1);
  const [date, setDate] = useState(todayStr());
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");

  useEffect(()=>{ (async()=>{
    try { setData(await weekSummary(userId, date)); }
    catch(e){ setErr(String(e)); }
  })(); }, [userId, date]);

  const maxKcal = useMemo(()=> Math.max(1, ...data.map(d=>d.totalKcal||0)), [data]);

  return (
    <>
      <div className="card">
        <div className="label">Semaine de</div>
        <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      </div>

      <div className="card">
        <h3>kcal par jour</h3>
        {err && <div style={{color:"#ff6b6b"}}>{err}</div>}
        <div className="list">
          {data.map((d, idx) => {
            const ratio = Math.min(1, (d.totalKcal||0)/maxKcal);
            return (
              <div key={d.date}>
                <div className="label">{dayNames[idx%7]} — {d.date}</div>
                <div className="bar"><div style={{width:(ratio*100)+"%", background:"var(--accent)"}}/></div>
                <div style={{fontSize:12, color:"var(--muted)"}}>{d.totalKcal||0} kcal</div>
              </div>
            );
          })}
          {!data.length && <div className="label">Aucune donnée</div>}
        </div>
      </div>
    </>
  );
}
