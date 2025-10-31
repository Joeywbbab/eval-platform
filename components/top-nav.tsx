"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { Search, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher } from "@/components/language-switcher"

type Notification = {
  id: string
  title: string
  description: string
  createdAt: string
  read: boolean
}

export function TopNav() {
  const pathname = usePathname()

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      title: "John Smith notify 你：",
      description: "已经完成任务请查收",
      createdAt: "2025-09-02 10:30",
      read: false,
    },
    {
      id: "n2",
      title: "Sarah Johnson notify 你：",
      description: "分配了新任务给你： review deliverables",
      createdAt: "2025-09-02 09:15",
      read: false,
    },
  ])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const tabs = [
    { label: "Operation", href: "/operation" },
    { label: "Evaluation", href: "/evaluation/feedback" },
  ]

  const isActive = (href: string) => Boolean(pathname && pathname.startsWith(href))

  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative text-sm font-medium text-muted-foreground hover:text-foreground",
                isActive(tab.href) && "text-foreground",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "absolute -bottom-3 left-0 h-0.5 w-full bg-foreground transition-opacity",
                  isActive(tab.href) ? "opacity-100" : "opacity-0",
                )}
              />
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        <button className="rounded-md p-2 hover:bg-accent/50" aria-label="Search">
          <Search className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-md p-2 hover:bg-accent/50" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[360px] p-0">
            <div className="p-4 text-base font-semibold">Notifications</div>
            <DropdownMenuSeparator />
            <div>
              {notifications.map((n) => (
                <div key={n.id} className="px-4 py-3 bg-accent/30">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-semibold">{n.title}</div>
                    {!n.read && <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500" />}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{n.description}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{n.createdAt}</div>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={markAllAsRead} className="cursor-pointer">
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="rounded-full border p-2 hover:bg-accent/50" aria-label="Profile">
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}


