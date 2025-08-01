export interface Meal {
  id: UUID,
  userId: UUID,
  name: string,
  description: string,
  created_at: Date
  isDietMeal: boolean
}