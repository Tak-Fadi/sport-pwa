import { useEffect, useState } from "react";
import { postMeal, daySummary, listMeals, removeMeal } from "../api";
import { Card, Input, Select, Button, Stat, Progress, Pill } from "../components/ui";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const todayStr = () => new Date().toISOString().slice(0,10);
const typeOptions = [
  { value:"breakfast", label:"Petit-déj" },
  { value:"lunch",     label:"Déjeuner" },
  { value:"dinner",    label:"Dîner" },
  { value:"snack",     label:"Collation" },
  { value:"other",     label:"Autre" },
];

const COLORS = {
  breakfast: "#60a5fa", // bleu
  lunch:     "#34d399", // vert
  dinner:    "#f59e0b", // orange
  snack:     "#f472b6", // rose
  other:     "#94a3b8"  // slate
};
const toChartData = (byType) =>
  Object.entries(byType || {}).map(([key, v]) => ({ name: key, value: v.kcal || 0 }));

export default function Journal(){
  const [userId] = useState(1);
  const [date, setDate] = useState(todayStr());
  const [form, setForm] = useState({ type:"lunch", kcal:"", protein:"", carbs:"", fat:"", note:"" });
  const [sum, setSum] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(2300); // objectif kcal

  async function load(){
    const [s, it] = await Promise.all([
      daySummary(userId, date),
      listMeals(userId, date)
    ]);
    setSum(s); setItems(it);
  }
  useEffect(()=>{ load(); }, [date]);

  async function onSubmit(e){
    e.preventDefault(); setLoading(true);
    await postMeal({
      userId, date, type: form.type,
      kcal: +form.kcal || 0,
      protein: +form.protein || 0,
      carbs: +form.carbs || 0,
      fat: +form.fat || 0,
      note: form.note || ""
    });
    setForm({ type:"lunch", kcal:"", protein:"", carbs:"", fat:"", note:"" });
    await load(); setLoading(false);
  }

  async function onDelete(id){ await removeMeal(userId, date, id); await load(); }

  return (
    <>
      <Card className="sticky top-[68px] z-10">
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <div className="text-xs text-white/60 mb-1">Date</div>
            <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">Objectif kcal</div>
            <Input type="number" value={target} onChange={e=>setTarget(+e.target.value||0)} />
          </div>
        </div>
        <div className="mt-3">
          <Progress value={sum?.totalKcal||0} max={target}/>
          <div className="mt-1 text-xs text-white/60">
            {sum?.totalKcal||0} / {target} kcal
          </div>
        </div>
      </Card>

      <Card title="Ajouter un repas">
        <form onSubmit={onSubmit} className="grid gap-3">
          <Select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="kcal" value={form.kcal} onChange={e=>setForm({...form, kcal:e.target.value})}/>
            <Input placeholder="prot (g)" value={form.protein} onChange={e=>setForm({...form, protein:e.target.value})}/>
            <Input placeholder="gluc (g)" value={form.carbs} onChange={e=>setForm({...form, carbs:e.target.value})}/>
            <Input placeholder="lip (g)" value={form.fat} onChange={e=>setForm({...form, fat:e.target.value})}/>
          </div>
          <Input placeholder="note" value={form.note} onChange={e=>setForm({...form, note:e.target.value})}/>
          <Button disabled={loading}>{loading ? "Envoi..." : "Enregistrer"}</Button>
        </form>
      </Card>

      <Card title="Totaux du jour">
        <div className="grid grid-cols-4 gap-2">
          <Stat label="kcal" value={sum?.totalKcal||0}/>
          <Stat label="P" value={sum?.p||0} suffix=" g"/>
          <Stat label="C" value={sum?.c||0} suffix=" g"/>
          <Stat label="F" value={sum?.f||0} suffix=" g"/>
        </div>
        {sum?.byType && (
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            {typeOptions.map(t=>{
              const s = sum.byType[t.value]; if(!s) return null;
              return (
                <div key={t.value} className="glass rounded-xl p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: COLORS[t.value] }} />
                    <span>{t.label}</span>
                  </div>
                  <span className="text-white/80">{s.kcal||0} kcal</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Répartition kcal (par type)">
        {sum?.byType ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={toChartData(sum.byType)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  stroke="none"
                >
                  {toChartData(sum.byType).map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name] || "#8884d8"} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v} kcal`, n]}
                  contentStyle={{ background: "rgba(17, 24, 39, .9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(name) => {
                    const map = { breakfast:"Petit-déj", lunch:"Déjeuner", dinner:"Dîner", snack:"Collation", other:"Autre" };
                    return <span className="text-sm text-white/80">{map[name] || name}</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-white/60 text-sm">Aucune donnée.</div>
        )}
      </Card>

      <Card title="Repas du jour">
        <div className="space-y-3">
          {items.map(m => (
            <div key={m.id} className="glass rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <Pill>{typeOptions.find(x=>x.value===m.type)?.label || "Autre"}</Pill>
                <button onClick={()=>onDelete(m.id)} className="tap text-[13px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">
                  Supprimer
                </button>
              </div>
              <div className="font-semibold">{m.kcal||0} kcal</div>
              <div className="text-sm text-white/70">P {m.protein||0}g · C {m.carbs||0}g · F {m.fat||0}g</div>
              {m.note && <div className="text-xs text-white/60 mt-1">{m.note}</div>}
            </div>
          ))}
          {!items.length && <div className="text-white/60 text-sm">Aucun repas pour cette date.</div>}
        </div>
      </Card>
    </>
  );
}
