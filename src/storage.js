import localforage from "localforage";
localforage.config({ name: "sportcoach", storeName: "db" });

const KEYS = {
  MEALS: (userId, date) => `meals:${userId}:${date}`,
  PLAN:  (userId) => `plan:${userId}`,
};

const TYPE_ORDER = ["breakfast","lunch","dinner","snack","other"];

export async function addMeal({ userId, date, type="other", kcal=0, protein=0, carbs=0, fat=0, note="" }) {
  const key = KEYS.MEALS(userId, date);
  const list = (await localforage.getItem(key)) || [];
  list.push({ id: crypto.randomUUID(), type, kcal, protein, carbs, fat, note });
  await localforage.setItem(key, list);
  return { ok: true };
}

export async function deleteMeal(userId, date, id){
  const key = KEYS.MEALS(userId, date);
  const list = (await localforage.getItem(key)) || [];
  const next = list.filter(m => m.id !== id);
  await localforage.setItem(key, next);
  return { ok:true };
}

export async function getMeals(userId, date){
  const key = KEYS.MEALS(userId, date);
  const list = (await localforage.getItem(key)) || [];
  // rétro-compat : si ancien item sans "type"
  return list.map(m => ({ type:"type" in m ? m.type : "other", ...m }));
}

export async function getDaySummary(userId, date) {
  const list = await getMeals(userId, date);
  const sum = list.reduce((a, m) => {
    a.kcal += m.kcal||0; a.p+=m.protein||0; a.c+=m.carbs||0; a.f+=m.fat||0; return a;
  }, {kcal:0,p:0,c:0,f:0});

  // agrégation par type
  const byType = {};
  for (const t of TYPE_ORDER) byType[t] = { kcal:0, p:0, c:0, f:0 };
  for (const m of list) {
    const t = TYPE_ORDER.includes(m.type) ? m.type : "other";
    byType[t].kcal += m.kcal||0;
    byType[t].p    += m.protein||0;
    byType[t].c    += m.carbs||0;
    byType[t].f    += m.fat||0;
  }
  return { date, totalKcal: sum.kcal, p: sum.p, c: sum.c, f: sum.f, byType, items:list };
}

export async function getWeekSummary(userId, anyDateStr) {
  const d = new Date(anyDateStr);
  const day = (d.getDay()+6)%7; // 0=lundi
  const monday = new Date(d); monday.setDate(d.getDate() - day);
  const out = [];
  for (let i=0;i<7;i++){
    const cur = new Date(monday); cur.setDate(monday.getDate()+i);
    const iso = cur.toISOString().slice(0,10);
    const s = await getDaySummary(userId, iso);
    out.push({ date: iso, totalKcal: s.totalKcal, p: s.p, c: s.c, f: s.f });
  }
  return out;
}

export async function getPlanLocal(userId){
  return (await localforage.getItem(KEYS.PLAN(userId))) || [];
}
export async function addPlanLocal({ userId, weekday, type, targetDurationMin=0, notes="" }){
  const key = KEYS.PLAN(userId);
  const list = (await localforage.getItem(key)) || [];
  list.push({ id: crypto.randomUUID(), weekday, type, targetDurationMin, notes });
  await localforage.setItem(key, list);
  return { ok:true };
}
