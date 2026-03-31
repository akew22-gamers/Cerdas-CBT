/**
 * Seeded random number generator (Mulberry32 algorithm)
 * Produces deterministic random numbers from a seed
 */
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle an array deterministically using a seed
 * Same seed = same shuffle order
 * 
 * @param array - Array to shuffle
 * @param seed - Random seed for deterministic shuffle
 * @returns New shuffled array
 */
export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

/**
 * Generate a random integer seed
 * Use for creating new randomization seeds
 */
export function generateRandomSeed(): number {
  return Math.floor(Math.random() * 2147483647); // Max 32-bit signed int
}

/**
 * Shuffle options for a question
 * Options are labeled A, B, C, D, E based on final position
 * 
 * @param options - Array of option texts
 * @param seed - Random seed
 * @returns Object with shuffled options and mapping to original correct answer
 */
export function shuffleOptions(
  options: { text: string; isCorrect: boolean }[],
  seed: number
): { 
  shuffled: { label: string; text: string; originalIndex: number }[];
  correctLabel: string;
} {
  const shuffled = shuffleWithSeed(options, seed);
  const labels = ['A', 'B', 'C', 'D', 'E'];
  
  const labeled = shuffled.map((opt, idx) => ({
    label: labels[idx],
    text: opt.text,
    originalIndex: options.indexOf(opt)
  }));
  
  // Find which label corresponds to the correct answer
  const correctOption = labeled.find((_, idx) => shuffled[idx].isCorrect);
  const correctLabel = correctOption?.label || 'A';
  
  return { shuffled: labeled, correctLabel };
}
