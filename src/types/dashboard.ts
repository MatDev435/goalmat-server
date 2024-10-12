import { Goal } from '@prisma/client'

export interface WeekCompletions {
  total: number
  percentage: number
}

export interface NewGoals {
  total: number
  percentage: number
}

export interface LastWeeks {
  startOfWeek: Date
  endOfWeek: Date
}
;[]

export interface DesiredWeeklyFrequencyGoals {
  goals: Goal[]
}
