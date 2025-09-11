// Type definitions for Pokémon data structure

export interface PokemonType {
  type: string;
  names: {
    English: string;
    German: string;
    French: string;
    Italian: string;
    Japanese: string;
    Korean: string;
    Spanish: string;
  };
}

export interface PokemonStats {
  stamina: number;
  attack: number;
  defense: number;
}

export interface MoveBuffs {
  activationChance: number;
  attackerAttackStatsChange: number | null;
  attackerDefenseStatsChange: number | null;
  targetAttackStatsChange: number | null;
  targetDefenseStatsChange: number | null;
}

export interface MoveCombat {
  energy: number;
  power: number;
  turns: number;
  buffs: MoveBuffs | null;
}

export interface Move {
  id: string;
  power: number;
  energy: number;
  durationMs: number;
  type: PokemonType;
  names: {
    English: string;
    German: string;
    French: string;
    Italian: string;
    Japanese: string;
    Korean: string;
    Spanish: string;
  };
  combat: MoveCombat;
}

export interface PokemonAssets {
  image: string;
  shinyImage: string;
}

export interface AssetForm {
  form: string | null;
  costume: string | null;
  isFemale: boolean;
  image: string;
  shinyImage: string;
}

export interface Evolution {
  id: string;
  formId: string;
  candies: number;
  item: string | null;
  quests: string[];
}

export interface MegaEvolution {
  id: string;
  formId: string;
  candies: number;
  energy: number;
}

export interface RegionForm {
  id: string;
  formId: string;
  dexNr: number;
  generation: number;
  names: {
    English: string;
    German: string;
    French: string;
    Italian: string;
    Japanese: string;
    Korean: string;
    Spanish: string;
  };
  stats: PokemonStats;
  primaryType: PokemonType;
  secondaryType: PokemonType | null;
  pokemonClass: string | null;
  quickMoves: Record<string, Move>;
  cinematicMoves: Record<string, Move>;
  eliteQuickMoves: Move[];
  eliteCinematicMoves: Record<string, Move>;
  assets: PokemonAssets | null;
  regionForms: Record<string, RegionForm>;
  evolutions: Evolution[];
  hasMegaEvolution: boolean;
  megaEvolutions: MegaEvolution[];
}

export interface Pokemon {
  id: string;
  formId: string;
  dexNr: number;
  generation: number;
  names: {
    English: string;
    German: string;
    French: string;
    Italian: string;
    Japanese: string;
    Korean: string;
    Spanish: string;
  };
  stats: PokemonStats;
  primaryType: PokemonType;
  secondaryType: PokemonType | null;
  pokemonClass: string | null;
  quickMoves: Record<string, Move>;
  cinematicMoves: Record<string, Move>;
  eliteQuickMoves: Move[];
  eliteCinematicMoves: Record<string, Move>;
  assets: PokemonAssets | null;
  regionForms: Record<string, RegionForm>;
  evolutions: Evolution[];
  hasMegaEvolution: boolean;
  megaEvolutions: MegaEvolution[];
  assetForms: AssetForm[];
}

// Utility types for search and filtering
export interface SearchFilters {
  name: string;
  type: string;
  generation: number | null;
  pokemonClass: string | null;
}

// Evolution chain types
export interface EvolutionChainNode {
  pokemon: Pokemon;
  evolvesTo: EvolutionChainNode[];
  evolutionRequirements?: {
    candies: number;
    item?: string;
    quests?: string[];
  };
}

// API response type
export type PokemonApiResponse = Pokemon[];

// Loading states
export interface LoadingState {
  isLoading: boolean;
  progress: number;
  error: string | null;
}
