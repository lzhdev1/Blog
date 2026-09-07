// Reserved Supabase types for future integration
// These interfaces will be used when Supabase is integrated

export interface Comment {
  id: string
  post_slug: string
  author_name: string
  author_email?: string
  content: string
  created_at: string
  updated_at: string
  approved: boolean
}

export interface Like {
  id: string
  post_slug: string
  user_id?: string
  ip_address?: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Comment, 'id' | 'created_at' | 'updated_at'>>
      }
      likes: {
        Row: Like
        Insert: Omit<Like, 'id' | 'created_at'>
        Update: Partial<Omit<Like, 'id' | 'created_at'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
