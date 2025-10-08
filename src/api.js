import {
  addMeal,
  getDaySummary,
  getWeekSummary,
  getPlanLocal,
  addPlanLocal,
  deleteMeal,
  getMeals
} from "./storage";

export async function postMeal(payload){ return addMeal(payload); }
export async function daySummary(userId, date){ return getDaySummary(userId, date); }
export async function weekSummary(userId, anyDate){ return getWeekSummary(userId, anyDate); }
export async function getPlan(userId){ return getPlanLocal(userId); }
export async function addPlan(day){ return addPlanLocal(day); }
export async function removeMeal(userId, date, id){ return deleteMeal(userId, date, id); }
export async function listMeals(userId, date){ return getMeals(userId, date); }
export async function removePlan(userId, id){ 
  const { deletePlanLocal } = await import("./storage");
  return deletePlanLocal(userId, id); 
}
