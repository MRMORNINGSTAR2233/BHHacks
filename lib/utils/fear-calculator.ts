/**
 * Calculates fear level based on story content and progression
 * @param currentLevel - Current fear level (0-100)
 * @param storyContent - The story text to analyze
 * @param choicesMade - Number of choices made so far
 * @returns New fear level (0-100)
 */
export function calculateFearLevel(
  currentLevel: number,
  storyContent: string,
  choicesMade: number
): number {
  let increase = 3; // Base increase per choice

  // Analyze story content for fear keywords
  const fearKeywords = [
    'scream', 'blood', 'death', 'terror', 'darkness', 'shadow',
    'horror', 'fear', 'panic', 'dread', 'nightmare', 'evil',
    'monster', 'ghost', 'demon', 'corpse', 'murder', 'kill',
    'pain', 'agony', 'torture', 'suffer', 'die', 'dead'
  ];

  const lowerContent = storyContent.toLowerCase();
  const keywordCount = fearKeywords.filter(kw => 
    lowerContent.includes(kw)
  ).length;

  // Add 2% per fear keyword found
  increase += keywordCount * 2;

  // Increase fear faster as story progresses
  if (choicesMade > 10) {
    increase += 2;
  }
  if (choicesMade > 15) {
    increase += 3;
  }

  // Cap at 100
  return Math.min(100, currentLevel + increase);
}

/**
 * Gets fear level label based on percentage
 */
export function getFearLabel(level: number): string {
  if (level < 20) return "Uneasy";
  if (level < 40) return "Nervous";
  if (level < 60) return "Frightened";
  if (level < 80) return "Terrified";
  return "Petrified";
}

/**
 * Gets fear level color class
 */
export function getFearColor(level: number): string {
  if (level < 20) return "from-green-500 to-yellow-500";
  if (level < 40) return "from-yellow-500 to-orange-500";
  if (level < 60) return "from-orange-500 to-red-500";
  if (level < 80) return "from-red-500 to-red-700";
  return "from-red-700 to-red-900";
}
