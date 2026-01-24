export interface EstimationResult {
  estimatedMinutes: number
  estimatedCost: { tts: number; ai: number; total: number }
  wordCount: number
}

const RATES = {
  ELEVENLABS_PER_1000_CHARS: 0.24,
  CLAUDE_INPUT_PER_1000_TOKENS: 0.003,
  CLAUDE_OUTPUT_PER_1000_TOKENS: 0.015,
  WORDS_PER_MINUTE: 150,
  CHARS_PER_WORD: 5,
  TOKENS_PER_WORD: 1.3,
}

const REPO_SIZE_MULTIPLIERS = {
  small: 0.8,
  medium: 1.0,
  large: 1.3,
}

const EXPERTISE_CONTEXT_MULTIPLIERS = {
  beginner: 1.2,
  intermediate: 1.0,
  expert: 0.9,
}

export function estimateGeneration(params: {
  targetDurationMinutes: number
  expertiseLevel: "beginner" | "intermediate" | "expert"
  repoSizeEstimate?: "small" | "medium" | "large"
}): EstimationResult {
  const { targetDurationMinutes, expertiseLevel, repoSizeEstimate = "medium" } = params

  const wordCount = Math.round(targetDurationMinutes * RATES.WORDS_PER_MINUTE)

  const characterCount = wordCount * RATES.CHARS_PER_WORD

  const ttsCost = (characterCount / 1000) * RATES.ELEVENLABS_PER_1000_CHARS

  const repoMultiplier = REPO_SIZE_MULTIPLIERS[repoSizeEstimate]
  const expertiseMultiplier = EXPERTISE_CONTEXT_MULTIPLIERS[expertiseLevel]

  const estimatedInputTokens = wordCount * RATES.TOKENS_PER_WORD * 3 * repoMultiplier * expertiseMultiplier
  const estimatedOutputTokens = wordCount * RATES.TOKENS_PER_WORD

  const aiInputCost = (estimatedInputTokens / 1000) * RATES.CLAUDE_INPUT_PER_1000_TOKENS
  const aiOutputCost = (estimatedOutputTokens / 1000) * RATES.CLAUDE_OUTPUT_PER_1000_TOKENS
  const aiCost = aiInputCost + aiOutputCost

  const totalCost = ttsCost + aiCost

  const generationTimeMultiplier = 2.5
  const estimatedMinutes = Math.ceil(targetDurationMinutes * generationTimeMultiplier)

  return {
    estimatedMinutes,
    estimatedCost: {
      tts: Math.round(ttsCost * 1000) / 1000,
      ai: Math.round(aiCost * 1000) / 1000,
      total: Math.round(totalCost * 100) / 100,
    },
    wordCount,
  }
}
