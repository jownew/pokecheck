export type TypeChart = Record<string, Record<string, number>>;

let cachedChart: TypeChart | null = null;

export async function loadTypeChart(): Promise<TypeChart> {
  if (cachedChart) return cachedChart;
  const res = await fetch('/data/type-chart.json', { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to load type chart');
  const data = (await res.json()) as TypeChart;
  cachedChart = data;
  return data;
}

export type Weakness = { type: string; multiplier: number };

export function computeWeaknesses(
  primaryType: string,
  secondaryType: string | null,
  chart: TypeChart
): Weakness[] {
  const attackers = Object.keys(chart);
  const result: Weakness[] = [];

  for (const atk of attackers) {
    const vsPrimary = chart[atk]?.[primaryType] ?? 1;
    const vsSecondary = secondaryType ? chart[atk]?.[secondaryType] ?? 1 : 1;
    const mult = Number((vsPrimary * vsSecondary).toFixed(2));
    if (mult > 1) {
      result.push({ type: atk, multiplier: mult });
    }
  }

  // Sort by multiplier desc, then alphabetically
  result.sort(
    (a, b) => b.multiplier - a.multiplier || a.type.localeCompare(b.type)
  );
  return result;
}

export type Effectiveness = { type: string; multiplier: number };

export function computeResistances(
  primaryType: string,
  secondaryType: string | null,
  chart: TypeChart
): Effectiveness[] {
  const attackers = Object.keys(chart);
  const result: Effectiveness[] = [];
  for (const atk of attackers) {
    const vsPrimary = chart[atk]?.[primaryType] ?? 1;
    const vsSecondary = secondaryType ? chart[atk]?.[secondaryType] ?? 1 : 1;
    const mult = Number((vsPrimary * vsSecondary).toFixed(2));
    if (mult > 0 && mult < 1) {
      result.push({ type: atk, multiplier: mult });
    }
  }
  // Sort by multiplier asc (0.25x first), then alphabetically
  result.sort(
    (a, b) => a.multiplier - b.multiplier || a.type.localeCompare(b.type)
  );
  return result;
}

export function computeImmunities(
  primaryType: string,
  secondaryType: string | null,
  chart: TypeChart
): Effectiveness[] {
  const attackers = Object.keys(chart);
  const result: Effectiveness[] = [];
  for (const atk of attackers) {
    const vsPrimary = chart[atk]?.[primaryType] ?? 1;
    const vsSecondary = secondaryType ? chart[atk]?.[secondaryType] ?? 1 : 1;
    const mult = Number((vsPrimary * vsSecondary).toFixed(2));
    if (mult === 0) {
      result.push({ type: atk, multiplier: mult });
    }
  }
  // Alphabetical
  result.sort((a, b) => a.type.localeCompare(b.type));
  return result;
}

// Offensive: what this attack type is strong against (defending types where multiplier > 1)
export function computeOffenseStrengths(
  attackerType: string,
  chart: TypeChart
): Effectiveness[] {
  const row = chart[attackerType];
  if (!row) return [];
  const out: Effectiveness[] = [];
  for (const defType of Object.keys(row)) {
    const mult = Number((row[defType] ?? 1).toFixed(2));
    if (mult > 1) out.push({ type: defType, multiplier: mult });
  }
  out.sort(
    (a, b) => b.multiplier - a.multiplier || a.type.localeCompare(b.type)
  );
  return out;
}
