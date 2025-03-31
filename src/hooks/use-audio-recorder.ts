import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioRecording } from '@/types';

interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  audioUrl: string | null;
}

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: [],
    audioUrl: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }
    };
  }, [state.audioUrl]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstart = () => {
        setState(prev => ({
          ...prev,
          isRecording: true,
          isPaused: false,
          recordingTime: 0,
          audioChunks: [],
          audioUrl: null,
          mediaRecorder: recorder
        }));
        
        timerRef.current = setInterval(() => {
          setState(prev => ({
            ...prev,
            recordingTime: prev.recordingTime + 1
          }));
        }, 1000);
      };
      
      recorder.onstop = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setState(prev => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          audioChunks: chunks,
          audioUrl
        }));
      };
      
      recorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (state.mediaRecorder && state.isRecording && !state.isPaused) {
      state.mediaRecorder.pause();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setState(prev => ({
        ...prev,
        isPaused: true
      }));
    }
  }, [state.mediaRecorder, state.isRecording, state.isPaused]);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (state.mediaRecorder && state.isRecording && state.isPaused) {
      state.mediaRecorder.resume();
      
      timerRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }));
      }, 1000);
      
      setState(prev => ({
        ...prev,
        isPaused: false
      }));
    }
  }, [state.mediaRecorder, state.isRecording, state.isPaused]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [state.mediaRecorder, state.isRecording]);

  // Get the audio recording
  const getRecording = useCallback((): AudioRecording | null => {
    if (state.audioUrl && state.audioChunks.length > 0) {
      const audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
      return {
        blob: audioBlob,
        url: state.audioUrl,
        duration: state.recordingTime
      };
    }
    return null;
  }, [state.audioUrl, state.audioChunks, state.recordingTime]);

  // Format recording time
  const formattedTime = useCallback(() => {
    const minutes = Math.floor(state.recordingTime / 60);
    const seconds = state.recordingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [state.recordingTime]);

  return {
    isRecording: state.isRecording,
    isPaused: state.isPaused,
    recordingTime: state.recordingTime,
    audioUrl: state.audioUrl,
    formattedTime: formattedTime(),
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    getRecording
  };
} 