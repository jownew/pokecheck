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

/**
 * Find Pokémon that the given Pokémon is weak to, ordered by weakness multiplier (highest first)
 * and prioritizing Pokémon that match multiple weakness types
 */
export function findPokemonWeakTo<
  T extends {
    names: { English: string };
    primaryType: { names: { English: string } };
    secondaryType?: { names: { English: string } } | null;
  }
>(
  targetPokemon: T,
  allPokemon: T[],
  chart: TypeChart
): Array<{
  pokemon: T;
  score: number;
  matchingTypes: string[];
}> {
  // Get the weaknesses of the target Pokémon
  const weaknesses = computeWeaknesses(
    targetPokemon.primaryType.names.English,
    targetPokemon.secondaryType?.names.English ?? null,
    chart
  );

  if (weaknesses.length === 0) return [];

  // Create a map of weakness types to their multipliers
  const weaknessMap = new Map<string, number>();
  weaknesses.forEach((w) => weaknessMap.set(w.type, w.multiplier));

  // Score each Pokémon based on how well they exploit the target's weaknesses
  const scoredPokemon: Array<{
    pokemon: T;
    score: number;
    matchingTypes: string[];
  }> = [];

  allPokemon.forEach((pokemon) => {
    const pokemonTypes: string[] = [
      pokemon.primaryType.names.English,
      pokemon.secondaryType?.names.English,
    ].filter((type): type is string => Boolean(type));

    const matchingTypes: string[] = [];
    let score = 0;

    pokemonTypes.forEach((type) => {
      if (weaknessMap.has(type)) {
        const multiplier = weaknessMap.get(type)!;
        matchingTypes.push(type);
        score += multiplier;
      }
    });

    if (score > 0) {
      scoredPokemon.push({ pokemon, score, matchingTypes });
    }
  });

  // Sort by score (highest first), then by number of matching types, then alphabetically
  scoredPokemon.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.matchingTypes.length !== a.matchingTypes.length) {
      return b.matchingTypes.length - a.matchingTypes.length;
    }
    return a.pokemon.names.English.localeCompare(b.pokemon.names.English);
  });

  return scoredPokemon;
}
