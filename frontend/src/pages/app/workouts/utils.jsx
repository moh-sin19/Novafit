import { getJson, postJson, deriveUserId } from "../../../utils/api";

export async function ensureTodayWorkoutSession() {
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem("userId");
  const userId = deriveUserId(
    token,
    storedUserId ? { id: storedUserId } : null
  );

  if (!userId) throw new Error("No user id found.");

  // 1. get user sessions
  const sessions = await getJson(`/api/workouts/user/${userId}`);

  const todayStr = new Date().toISOString().split("T")[0];
  const todaySession = (sessions || []).find((s) => s.date === todayStr);

  if (todaySession) return todaySession;

  // 2. else create one
  const created = await postJson("/api/workouts", {
    userId: Number(userId),
    date: todayStr,
    notes: "Auto-created session",
  });
  return created;
}
