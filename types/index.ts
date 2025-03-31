export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  audio_url?: string;
  transcription: string;
  sentiment: {
    score: number;
    label: string;
    details: string;
  };
  sentiment_score?: number;
  created_at: string;
  updated_at: string;
}

export interface DailyPrompt {
  id: string;
  prompt: string;
  created_at: string;
  used_at: string | null;
} 