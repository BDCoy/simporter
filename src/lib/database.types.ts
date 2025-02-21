export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          user_id: string
          content: string
          type: 'user' | 'assistant'
          created_at: string
          tokens_used: number | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          type: 'user' | 'assistant'
          created_at?: string
          tokens_used?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          type?: 'user' | 'assistant'
          created_at?: string
          tokens_used?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}