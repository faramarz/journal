"use client";

import { useState } from "react";
import { Mic, Square, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

interface VoiceRecorderProps {
  onRecordingComplete: (recording: { blob: Blob; url: string; duration: number }) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [showControls, setShowControls] = useState(false);
  const {
    isRecording,
    isPaused,
    audioUrl,
    formattedTime,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    getRecording
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setShowControls(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    const recording = getRecording();
    if (recording) {
      onRecordingComplete(recording);
    }
  };

  const handlePauseResumeRecording = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          {audioUrl ? (
            <div className="w-full space-y-2">
              <audio src={audioUrl} controls className="w-full" />
              <div className="flex justify-center">
                <Button onClick={() => setShowControls(false)}>Record Again</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center text-xl font-medium">
                {isRecording ? formattedTime : "Ready to Record"}
              </div>
              <div className="flex items-center justify-center gap-4">
                {!showControls ? (
                  <Button
                    size="lg"
                    className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={handleStartRecording}
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 w-12 rounded-full"
                      onClick={handlePauseResumeRecording}
                    >
                      {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                    </Button>
                    <Button
                      size="lg"
                      variant="destructive"
                      className="h-12 w-12 rounded-full"
                      onClick={handleStopRecording}
                    >
                      <Square className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
              {isRecording && (
                <p className="text-center text-sm text-muted-foreground">
                  {isPaused ? "Recording paused" : "Recording in progress..."}
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 