import { useEffect, useMemo, useState } from "react";
import { weekSummary } from "../api";
import { Card, Stat } from "../components/ui";

const fmt = (d) => d.toISOString().slice(0,10);
const toMonday = (any) => {
  const d = new Date(any);
  const day = (d.getDay() + 6) % 7; // 0 = lundi
  const m = new Date(d); m.setDate(d.getDate() - day);
  m.setHours(0,0,0,0);
  return m;
};
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const WEEKDAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

export default function Week(){
  const [userId] = useState(1);
  const [anchor, setAnchor] = useState(fmt(new Date())); // date courante (ancre pour la semaine)
  const monday = useMemo(()=> toMonday(anchor), [anchor]);
  const sunday = useMemo(()=> addDays(monday, 6), [monday]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true);
    const data = await weekSummary(userId, anchor);
    setRows(data);
    setLoading(false);
  }
  useEffect(()=>{ load(); }, [anchor]);

  const total = rows.reduce((a, r)=>a+(r.totalKcal||0), 0);
  const max = Math.max(1, ...rows.map(r=>r.totalKcal||0));
  const title = `${monday.toLocaleDateString("fr-FR")} → ${sunday.toLocaleDateString("fr-FR")}`;

  return (
    <>
      <Card title="Semaine">
        <div className="text-sm text-white/70 mb-3">{title}</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            className="glass rounded-xl py-2 hover:bg-white/10"
            onClick={()=> setAnchor(fmt(addDays(monday, -7)))}
          >← Préc.</button>
          <button
            className="glass rounded-xl py-2 hover:bg-white/10"
            onClick={()=> setAnchor(fmt(new Date()))}
          >Cette semaine</button>
          <button
            className="glass rounded-xl py-2 hover:bg-white/10"
            onClick={()=> setAnchor(fmt(addDays(monday, 7)))}
          >Suiv. →</button>
        </div>
      </Card>

      <Card title="Résumé kcal / jour">
        {loading ? (
          <div className="text-white/60 text-sm">Chargement…</div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <Stat label="Total" value={total} suffix=" kcal" />
              <Stat label="Moy." value={Math.round(total/7)} suffix=" kcal" />
              <Stat label="Max" value={max} suffix=" kcal" />
              <Stat label="Jours" value={rows.filter(r=>r.totalKcal>0).length} />
            </div>

            <div className="space-y-2">
              {rows.map((r, idx) => {
                const pct = Math.round(((r.totalKcal||0) / max) * 100);
                const date = new Date(r.date);
                const label = `${WEEKDAYS[idx]} ${date.toLocaleDateString("fr-FR", { day:"2-digit", month:"2-digit" })}`;
                return (
                  <div key={r.date} className="glass rounded-xl p-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">{label}</span>
                      <span className="text-white/70">{r.totalKcal||0} kcal</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </>
  );
}
