export interface Checkin {
  barId: string
  barName: string
  timestamp: string
}

export function getCheckins(): Checkin[] {
  if (typeof window === 'undefined') return []
  const storedCheckins = localStorage.getItem('checkins')
  return storedCheckins ? JSON.parse(storedCheckins) : []
}

export function addCheckin(checkin: Checkin): void {
  if (typeof window === 'undefined') return
  const checkins = getCheckins()
  checkins.push(checkin)
  localStorage.setItem('checkins', JSON.stringify(checkins))
}