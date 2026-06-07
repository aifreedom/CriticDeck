export const toneForScore = (score?: number | null): 'great' | 'good' | 'weak' | 'unknown' => {
  if (typeof score !== 'number') return 'unknown'
  if (score >= 75) return 'great'
  if (score >= 60) return 'good'
  return 'weak'
}

export const toneForUserScore = (score?: number | null): 'great' | 'good' | 'weak' | 'unknown' => {
  if (typeof score !== 'number') return 'unknown'
  if (score >= 8) return 'great'
  if (score >= 6.5) return 'good'
  return 'weak'
}
