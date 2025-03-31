import { TranscriptionResult } from '@/types';

const apiKey = process.env.ASSEMBLY_AI_API_KEY;

/**
 * Transcribe audio using AssemblyAI
 */
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
  try {
    if (!apiKey) {
      throw new Error('AssemblyAI API key is not set');
    }

    // First, upload the audio file to AssemblyAI
    const uploadUrl = await uploadAudioToAssemblyAI(audioBlob);
    if (!uploadUrl) {
      throw new Error('Failed to upload audio to AssemblyAI');
    }

    // Then submit the transcription request
    const transcriptId = await submitTranscriptionRequest(uploadUrl);
    if (!transcriptId) {
      throw new Error('Failed to submit transcription request');
    }

    // Finally, get the transcription result
    const result = await getTranscriptionResult(transcriptId);
    return { text: result.text || '', confidence: result.confidence };
  } catch (error) {
    console.error('AssemblyAI transcription error:', error);
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Unknown transcription error'
    };
  }
}

/**
 * Upload audio to AssemblyAI
 */
async function uploadAudioToAssemblyAI(audioBlob: Blob): Promise<string> {
  const response = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      'Authorization': apiKey!,
      'Content-Type': 'application/json'
    },
    body: audioBlob
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data.upload_url;
}

/**
 * Submit a transcription request to AssemblyAI
 */
async function submitTranscriptionRequest(audioUrl: string): Promise<string> {
  const response = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Authorization': apiKey!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      language_code: 'en',
      punctuate: true,
      format_text: true
    })
  });

  if (!response.ok) {
    throw new Error(`Transcription request failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data.id;
}

/**
 * Get transcription result from AssemblyAI
 */
async function getTranscriptionResult(transcriptId: string): Promise<{ text?: string; confidence?: number }> {
  let result = { status: 'processing' };
  
  // Poll until the transcription is complete
  while (result.status !== 'completed' && result.status !== 'error') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey!,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get transcript with status: ${response.status}`);
    }

    result = await response.json();
  }

  if (result.status === 'error') {
    throw new Error(result.error || 'Transcription failed');
  }

  return {
    text: result.text,
    confidence: result.confidence
  };
}

// Helper function to check if we should use AssemblyAI
export function isConfigured(): boolean {
  return !!apiKey && apiKey !== 'your-assembly-ai-api-key';
} 