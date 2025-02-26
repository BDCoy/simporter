"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Session, User } from "@supabase/supabase-js"

export interface UserDataInterface {
  level: number
  current_xp: number
  xp_for_next_level: number
  streak: number
  remaining_tokens: number
  dog_level: string
}

interface AuthContextType {
  session: Session | null
  user: User | null
  userData: UserDataInterface
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserDataInterface>({
    level: 0,
    current_xp: 0,
    xp_for_next_level: 0,
    streak: 0,
    remaining_tokens: 0,
    dog_level: "",
  })
  const supabase = createClient()

  useEffect(() => {
    const setServerSession = async () => {
      const {
        data: { session: serverSession },
      } = await supabase.auth.getSession()
      setSession(serverSession)
      setUser(serverSession?.user ?? null)
    }

    setServerSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("level, current_xp, xp_for_next_level, streak, remaining_tokens, dog_level")
          .eq("user_id", user.id)
          .single()

        if (error) {
          console.error("Error fetching user data:", error)
        } else {
          setUserData(data)
        }
      }
    }

    fetchUserData()
  }, [user, supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const refreshSession = async () => {
    const {
      data: { session: refreshedSession },
      error,
    } = await supabase.auth.refreshSession()
    if (error) throw error
    setSession(refreshedSession)
    setUser(refreshedSession?.user ?? null)
  }

  return (
    <AuthContext.Provider value={{ session, user, userData, signIn, signUp, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}