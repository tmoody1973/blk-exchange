export const SEASON_CONFIG = {
  number: 1,
  name: "Season 1",
  startDate: new Date("2026-03-24T00:00:00-05:00"), // Season started with development
  weeks: 8,
  endDate: new Date("2026-05-18T23:59:59-05:00"), // 8 weeks from start
} as const;

export function getSeasonInfo() {
  const now = Date.now();
  const start = SEASON_CONFIG.startDate.getTime();
  const end = SEASON_CONFIG.endDate.getTime();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;

  if (now < start) {
    return {
      seasonNumber: SEASON_CONFIG.number,
      currentWeek: 0,
      totalWeeks: SEASON_CONFIG.weeks,
      isActive: false,
      isComplete: false,
      label: `${SEASON_CONFIG.name} starts ${SEASON_CONFIG.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      endsLabel: "",
      msUntilEnd: end - now,
    };
  }

  if (now > end) {
    return {
      seasonNumber: SEASON_CONFIG.number,
      currentWeek: SEASON_CONFIG.weeks,
      totalWeeks: SEASON_CONFIG.weeks,
      isActive: false,
      isComplete: true,
      label: `${SEASON_CONFIG.name} Complete`,
      endsLabel: "Season 2 coming soon",
      msUntilEnd: 0,
    };
  }

  const msElapsed = now - start;
  const currentWeek = Math.min(
    SEASON_CONFIG.weeks,
    Math.ceil(msElapsed / msPerWeek)
  );

  const endDateStr = SEASON_CONFIG.endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return {
    seasonNumber: SEASON_CONFIG.number,
    currentWeek,
    totalWeeks: SEASON_CONFIG.weeks,
    isActive: true,
    isComplete: false,
    label: `${SEASON_CONFIG.name} — Week ${currentWeek} of ${SEASON_CONFIG.weeks}`,
    endsLabel: `Ends ${endDateStr}`,
    msUntilEnd: end - now,
  };
}

export function getMsUntilNextMonday(): number {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
  const nextMonday = new Date(now);
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
  nextMonday.setUTCHours(5, 0, 0, 0); // midnight ET = 5:00 UTC
  return nextMonday.getTime() - now.getTime();
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "now";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
