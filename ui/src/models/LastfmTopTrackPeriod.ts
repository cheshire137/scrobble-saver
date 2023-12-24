export const defaultLastfmTopTrackPeriod = '3month'

export const topTrackPeriods = [
  { value: 'overall', label: 'All time' },
  { value: '7day', label: 'Last week' },
  { value: '1month', label: 'Last month' },
  { value: '3month', label: 'Last 3 months' },
  { value: '6month', label: 'Last 6 months' },
  { value: '12month', label: 'Last year' },
]

export const topTrackPeriodLabel = (period?: string | null): string => {
  if (!period) return topTrackPeriodLabel(defaultLastfmTopTrackPeriod)
  return topTrackPeriods.find(p => p.value === period)?.label ?? period
}
