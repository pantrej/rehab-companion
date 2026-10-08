export type PlanChange = {
  date: string
  title: string
  change: string
  reason: string
  // Who made the change. Plan changes only ever come from the professional, never from the app.
  updatedBy: string
  appliesFrom?: string
}
