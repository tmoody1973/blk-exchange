export function getCurrentWeek(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7
  );
  return `${now.getFullYear()}-W${week.toString().padStart(2, "0")}`;
}

export function getCurrentSeason(): string {
  return "season-1"; // MVP: single season
}
