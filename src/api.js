import { addMeal, getDaySummary, getWeekSummary, getPlanLocal, addPlanLocal } from "./storage";

export async function postMeal(payload){ return addMeal(payload); }
export async function daySummary(userId, date){ return getDaySummary(userId, date); }
export async function weekSummary(userId, anyDate){ return getWeekSummary(userId, anyDate); }
export async function getPlan(userId){ return getPlanLocal(userId); }
export async function addPlan(day){ return addPlanLocal(day); }
