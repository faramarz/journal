import OpenAI from 'openai';
import { TranscriptionResult, SentimentAnalysis, JournalPrompt } from '@/types';

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
  try {
    // Convert blob to file
    const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to transcribe audio');
    }
    
    const data = await response.json();
    return { text: data.text };
  } catch (error) {
    console.error('Transcription error:', error);
    return { 
      text: '', 
      error: error instanceof Error ? error.message : 'Unknown transcription error' 
    };
  }
}

/**
 * Mock implementation for development/testing when API key not available
 */
export async function mockTranscribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    text: "Today I had a productive day. I completed the project I've been working on for weeks and got positive feedback from my manager. I feel accomplished and proud of my work. Tomorrow I'll start on the new feature implementation.",
    confidence: 0.95
  };
}

/**
 * Analyze sentiment of text using OpenAI
 */
export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the following journal entry and respond with only a JSON object with these fields: sentiment (positive, negative, or neutral), score (number between -1 and 1), and a brief explanation. Be nuanced in your analysis."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content) as SentimentAnalysis;
    return result;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    // Fallback to simple sentiment detection
    const lowercaseText = text.toLowerCase();
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'joy', 'love', 'excited', 'proud', 'accomplished'];
    const negativeWords = ['sad', 'bad', 'awful', 'terrible', 'angry', 'upset', 'disappointed', 'frustrated', 'anxious'];
    
    let score = 0;
    positiveWords.forEach(word => {
      if (lowercaseText.includes(word)) score += 0.2;
    });
    negativeWords.forEach(word => {
      if (lowercaseText.includes(word)) score -= 0.2;
    });
    
    // Clamp between -1 and 1
    score = Math.max(-1, Math.min(1, score));
    
    const sentiment = score > 0.3 ? 'positive' : score < -0.3 ? 'negative' : 'neutral';
    
    return {
      sentiment,
      score,
      explanation: `Basic sentiment detection (fallback method): ${sentiment}`
    };
  }
}

/**
 * Mock implementation for development/testing when API key not available
 */
export async function mockAnalyzeSentiment(text: string): Promise<SentimentAnalysis> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Sample sentiments based on text content
  if (text.toLowerCase().includes('happy') || text.toLowerCase().includes('good')) {
    return {
      sentiment: 'positive',
      score: 0.8,
      explanation: 'The journal entry contains positive language and expresses satisfaction with accomplishments.'
    };
  } else if (text.toLowerCase().includes('sad') || text.toLowerCase().includes('frustrat')) {
    return {
      sentiment: 'negative',
      score: -0.7,
      explanation: 'The journal entry expresses frustration and negative emotions about challenges faced.'
    };
  } else {
    return {
      sentiment: 'neutral',
      score: 0.1,
      explanation: 'The journal entry is mostly factual and doesn\'t express strong emotions.'
    };
  }
}

/**
 * Generate a journaling prompt using OpenAI
 */
export async function generatePrompt(): Promise<JournalPrompt> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful journaling coach. Generate a single reflective journal prompt that inspires deep thinking and self-reflection. Respond with a JSON object with two fields: text (the prompt) and category (e.g., 'gratitude', 'reflection', 'future', 'challenge', etc.)."
        },
        {
          role: "user",
          content: "Generate a journal prompt for today."
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content) as JournalPrompt;
    return result;
  } catch (error) {
    console.error('Prompt generation error:', error);
    // Return a fallback prompt
    return {
      text: "What are three things that went well today, and why do you think they went well?",
      category: "reflection"
    };
  }
}

/**
 * Get a predefined prompt for development/testing when API key not available
 */
export function getRandomPrompt(): JournalPrompt {
  const prompts = [
    { text: "What are three things you're grateful for today?", category: "gratitude" },
    { text: "What's something that challenged you today, and how did you handle it?", category: "challenge" },
    { text: "What are you looking forward to tomorrow?", category: "future" },
    { text: "Describe a moment of joy you experienced recently.", category: "joy" },
    { text: "What's something you'd like to improve about yourself, and what steps can you take?", category: "growth" }
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Helper function to check if we should use mock implementations
export function shouldUseMock(): boolean {
  return !apiKey || apiKey === 'your-openai-api-key';
} 