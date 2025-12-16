//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
import { getJson } from "./api";

/**
 * Fetch calories burned vs food consumed (weekly or monthly)
 * @param {string} period - "weekly" or "monthly"
 * @returns {Promise<{data: Array<{period: string, caloriesBurned: number, caloriesConsumed: number}>}>}
 */
export async function getCaloriesBurnedVsFood(period = "weekly") {
  return getJson(`/api/insights/calories-burned-vs-food?period=${period}`);
}

/**
 * Fetch macro breakdown for current month
 * @returns {Promise<{carbsPercentage: number, proteinPercentage: number, fatPercentage: number, totalCarbs: number, totalProtein: number, totalFat: number}>}
 */
export async function getMacroBreakdown() {
  return getJson("/api/insights/macro-breakdown");
}

/**
 * Fetch calories consumed vs target (weekly or monthly)
 * @param {string} period - "weekly" or "monthly"
 * @returns {Promise<{data: Array<{period: string, actualCalories: number, targetCalories: number}>, targetCalories: number}>}
 */
export async function getCaloriesVsTarget(period = "weekly") {
  return getJson(`/api/insights/calories-vs-target?period=${period}`);
}

/**
 * Fetch weight progress over time (weekly or monthly)
 * @param {string} period - "weekly" or "monthly"
 * @returns {Promise<{data: Array<{date: string, actualWeight: number, targetWeight: number}>, targetWeight: number}>}
 */
export async function getWeightProgress(period = "weekly") {
  return getJson(`/api/insights/weight-progress?period=${period}`);
}
