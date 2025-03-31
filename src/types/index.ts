export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  audio_url: string;
  sentiment: string;
  created_at: string;
  updated_at: string;
  prompt_used?: string;
} 