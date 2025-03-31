import { useState, useEffect, useCallback } from 'react';
import { JournalEntry, NewJournalEntry, AudioRecording, TranscriptionResult, SentimentAnalysis } from '@/types';
import supabase from '@/lib/supabase/client';
import * as OpenAI from '@/lib/openai';
import * as AssemblyAI from '@/lib/assemblyai';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all journal entries for the current user
  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You must be logged in to view journal entries');
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch journal entries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch entries on mount and auth state change
  useEffect(() => {
    fetchEntries();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchEntries();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchEntries]);

  // Transcribe audio
  const transcribeAudio = useCallback(async (recording: AudioRecording): Promise<TranscriptionResult> => {
    try {
      // Check if AssemblyAI is configured, otherwise use OpenAI
      if (AssemblyAI.isConfigured()) {
        return await AssemblyAI.transcribeAudio(recording.blob);
      } else if (OpenAI.shouldUseMock()) {
        return await OpenAI.mockTranscribeAudio(recording.blob);
      } else {
        return await OpenAI.transcribeAudio(recording.blob);
      }
    } catch (error) {
      console.error('Transcription error:', error);
      return {
        text: '',
        error: error instanceof Error ? error.message : 'Transcription failed'
      };
    }
  }, []);

  // Analyze sentiment
  const analyzeSentiment = useCallback(async (text: string): Promise<SentimentAnalysis> => {
    try {
      if (OpenAI.shouldUseMock()) {
        return await OpenAI.mockAnalyzeSentiment(text);
      } else {
        return await OpenAI.analyzeSentiment(text);
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        error: error instanceof Error ? error.message : 'Sentiment analysis failed'
      };
    }
  }, []);

  // Upload audio to storage
  const uploadAudio = useCallback(async (recording: AudioRecording): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to upload audio');
      }

      const userId = session.user.id;
      const filePath = `${userId}/${new Date().toISOString()}.webm`;
      
      const { error: uploadError } = await supabase.storage
        .from('journal_audio')
        .upload(filePath, recording.blob);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('journal_audio')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading audio:', error);
      return null;
    }
  }, []);

  // Create a new journal entry
  const createEntry = useCallback(async (
    recording: AudioRecording,
    transcription: TranscriptionResult,
    sentiment: SentimentAnalysis,
    promptText?: string
  ) => {
    try {
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to create a journal entry');
      }

      // Upload audio if transcription was successful
      let audioUrl = null;
      if (transcription.text) {
        audioUrl = await uploadAudio(recording);
      }

      const newEntry: NewJournalEntry = {
        title: `Journal Entry - ${new Date().toLocaleDateString()}`,
        transcript: transcription.text,
        audio_url: audioUrl || undefined,
        sentiment: sentiment.sentiment,
        prompt_used: promptText
      };

      const { data, error: insertError } = await supabase
        .from('journal_entries')
        .insert(newEntry)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Update entries list
      setEntries(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      console.error('Error creating journal entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to create journal entry');
      return null;
    }
  }, [uploadAudio]);

  // Delete a journal entry
  const deleteEntry = useCallback(async (entryId: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (deleteError) {
        throw deleteError;
      }

      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete journal entry');
    }
  }, []);

  // Get daily prompt
  const getPrompt = useCallback(async () => {
    try {
      if (OpenAI.shouldUseMock()) {
        return OpenAI.getRandomPrompt();
      } else {
        return await OpenAI.generatePrompt();
      }
    } catch (error) {
      console.error('Error getting prompt:', error);
      return {
        text: "What's on your mind today?",
        category: "general"
      };
    }
  }, []);

  return {
    entries,
    isLoading,
    error,
    fetchEntries,
    transcribeAudio,
    analyzeSentiment,
    createEntry,
    deleteEntry,
    getPrompt
  };
} 