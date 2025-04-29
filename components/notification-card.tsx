import type { ReactNode } from "react"

interface NotificationCardProps {
  icon: ReactNode
  title: string
  description: string
  time: string
}

export function NotificationCard({ icon, title, description, time }: NotificationCardProps) {
  return (
    <div className="flex gap-3 rounded-lg border p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">{icon}</div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="mt-1 text-xs text-slate-400">{time}</p>
      </div>
    </div>
  )
}
