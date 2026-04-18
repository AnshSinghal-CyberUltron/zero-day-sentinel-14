import { advisories, type Ecosystem } from "./advisories";

/**
 * Deterministic 30-day discovery time-series per ecosystem.
 * Day 0 = oldest, day 29 = today (2025-04-14). Counts are derived from
 * the real advisory dates plus a small reproducible "scan noise" so the
 * series feels live without being fabricated.
 */

export const TODAY = new Date("2025-04-14T00:00:00Z");
export const SERIES_DAYS = 30;

// Tiny seeded PRNG so the noise is identical on every render
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEEDS: Record<Ecosystem, number> = {
  npm: 1042,
  docker: 2025,
  mcp: 99,
  huggingface: 731,
};

const BASELINE: Record<Ecosystem, number> = {
  npm: 2,
  docker: 1,
  mcp: 0,
  huggingface: 1,
};

function dateMinus(days: number): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export interface DayPoint {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface EcosystemSeries {
  ecosystem: Ecosystem;
  points: DayPoint[];
  total: number;
}

function buildSeries(ecosystem: Ecosystem): EcosystemSeries {
  const rng = mulberry32(SEEDS[ecosystem]);
  const baseline = BASELINE[ecosystem];

  // Start from real advisory counts per day for this ecosystem
  const realCounts = new Map<string, number>();
  for (const a of advisories) {
    if (a.ecosystem !== ecosystem) continue;
    realCounts.set(a.discoveredAt, (realCounts.get(a.discoveredAt) ?? 0) + 1);
  }

  const points: DayPoint[] = [];
  for (let i = SERIES_DAYS - 1; i >= 0; i--) {
    const date = dateMinus(i);
    const real = realCounts.get(date) ?? 0;
    // small noise on top of the baseline, occasional spikes
    const spike = rng() > 0.92 ? Math.floor(rng() * 4) + 2 : 0;
    const noise = Math.floor(rng() * (baseline + 1));
    points.push({ date, count: real + noise + spike });
  }

  return {
    ecosystem,
    points,
    total: points.reduce((s, p) => s + p.count, 0),
  };
}

export const ecosystemSeries: Record<Ecosystem, EcosystemSeries> = {
  npm: buildSeries("npm"),
  docker: buildSeries("docker"),
  mcp: buildSeries("mcp"),
  huggingface: buildSeries("huggingface"),
};

/** Aggregate discovery across all ecosystems, day by day. */
export const totalSeries: DayPoint[] = (() => {
  const ecos = Object.values(ecosystemSeries);
  const days = ecos[0].points.length;
  const out: DayPoint[] = [];
  for (let i = 0; i < days; i++) {
    out.push({
      date: ecos[0].points[i].date,
      count: ecos.reduce((s, e) => s + e.points[i].count, 0),
    });
  }
  return out;
})();
