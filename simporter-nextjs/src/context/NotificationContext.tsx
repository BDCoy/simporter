"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { createClient } from "@/utils/supabase/client"

interface Notification {
  id: string
  message: string
  timestamp: string
  type: string
  title: string
  action: string
}

interface NotificationContextType {
  pendingNotifications: Notification[]
  pastNotifications: Notification[]
  markAsRead: (ids: string[]) => Promise<void>
  clearAll: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>([])
  const [pastNotifications, setPastNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("pending_notifications, past_notifications")
          .eq("user_id", user.id)
          .single()

        if (error) throw error

        console.log('notification data', data)

        const sortedPendingNotifications = (data.pending_notifications || []).sort((a: Notification, b: Notification) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        const sortedPastNotifications = (data.past_notifications || []).sort((a: Notification, b: Notification) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        setPendingNotifications(sortedPendingNotifications)
        setPastNotifications(sortedPastNotifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user, supabase, reload])

  const markAsRead = async (ids: string[]) => {
    try {
      const readNotifications = pendingNotifications.filter(notification => ids.includes(notification.id))
      const updatedPendingNotifications = pendingNotifications.filter(notification => !ids.includes(notification.id))
      const updatedPastNotifications = [...pastNotifications, ...readNotifications].sort((a: Notification, b: Notification) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      const { error } = await supabase
        .from("users")
        .update({
          pending_notifications: updatedPendingNotifications,
          past_notifications: updatedPastNotifications
        })
        .eq("user_id", user?.id)

      if (error) throw error

      setPendingNotifications(updatedPendingNotifications)
      setPastNotifications(updatedPastNotifications)
      setReload(true) // Trigger reload
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  useEffect(() => {
    if (reload) {
      setReload(false) // Reset reload state after reloading notifications
    }
  }, [reload])

  const clearAll = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ past_notifications: null })
        .eq("user_id", user?.id)

      if (error) throw error

      setPastNotifications([])
    } catch (error) {
      console.error("Error clearing notifications:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        pendingNotifications,
        pastNotifications,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}