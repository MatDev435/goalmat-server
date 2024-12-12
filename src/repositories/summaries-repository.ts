import { WeekSummary } from '../types/week-summary'

export interface SummariesRepository {
  getUserWeekSummary(userId: string): Promise<WeekSummary>
  getUserLastWeekSummary(userId: string): Promise<WeekSummary>
  getGroupWeekSummary(groupId: string): Promise<WeekSummary>
}
