import localforage from "localforage";

localforage.config({ name: "sportcoach", storeName: "db" });

const KEYS = {
  MEALS: (userId, date) => `meals:${userId}:${date}`,          // liste d'entrées de repas pour ce jour
  PLAN:  (userId) => `plan:${userId}`,                          // liste de jours d'entraînement
};

// ---- MEALS ----
export async function addMeal({ userId, date, kcal=0, protein=0, carbs=0, fat=0, note="" }) {
  const key = KEYS.MEALS(userId, date);
  const list = (await localforage.getItem(key)) || [];
  list.push({ id: crypto.randomUUID(), kcal, protein, carbs, fat, note });
  await localforage.setItem(key, list);
  return { ok: true };
}

export async function getDaySummary(userId, date) {
  const key = KEYS.MEALS(userId, date);
  const list = (await localforage.getItem(key)) || [];
  const sum = list.reduce((a, m) => {
    a.kcal += m.kcal||0; a.p+=m.protein||0; a.c+=m.carbs||0; a.f+=m.fat||0; return a;
  }, {kcal:0,p:0,c:0,f:0});
  return { date, totalKcal: sum.kcal, p: sum.p, c: sum.c, f: sum.f };
}

export async function getWeekSummary(userId, anyDateStr) {
  const d = new Date(anyDateStr);
  const day = (d.getDay()+6)%7; // 0=Lundi
  const monday = new Date(d); monday.setDate(d.getDate() - day);
  const out = [];
  for (let i=0;i<7;i++){
    const cur = new Date(monday); cur.setDate(monday.getDate()+i);
    const iso = cur.toISOString().slice(0,10);
    out.push(await getDaySummary(userId, iso));
  }
  return out;
}

// ---- PLAN ----
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
