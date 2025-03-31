"use client";

import { useState } from "react";
import { VoiceRecorder } from "@/components/journal/voice-recorder";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AudioRecording, TranscriptionResult, SentimentAnalysis, JournalPrompt } from "@/types";
import { useJournal } from "@/hooks/use-journal";

interface JournalCreatorProps {
  onEntryCreated: () => void;
}

export function JournalCreator({ onEntryCreated }: JournalCreatorProps) {
  const [step, setStep] = useState<"prompt" | "record" | "review" | "processing">("prompt");
  const [recording, setRecording] = useState<AudioRecording | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [sentimentResult, setSentimentResult] = useState<SentimentAnalysis | null>(null);
  const [prompt, setPrompt] = useState<JournalPrompt | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { transcribeAudio, analyzeSentiment, createEntry, getPrompt } = useJournal();

  // Handle recording completion
  const handleRecordingComplete = async (recording: AudioRecording) => {
    setRecording(recording);
    setStep("processing");
    setIsProcessing(true);
    setError(null);
    
    try {
      // Transcribe the audio
      const transcriptionResult = await transcribeAudio(recording);
      setTranscriptionResult(transcriptionResult);
      
      if (transcriptionResult.error) {
        throw new Error(transcriptionResult.error);
      }
      
      setTranscript(transcriptionResult.text);
      
      // Analyze sentiment if transcription was successful
      if (transcriptionResult.text) {
        const sentimentResult = await analyzeSentiment(transcriptionResult.text);
        setSentimentResult(sentimentResult);
      }
      
      // Move to review step
      setStep("review");
    } catch (err) {
      console.error("Error processing recording:", err);
      setError(err instanceof Error ? err.message : "Failed to process recording");
      setStep("record");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle transcript edit
  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!recording || !transcript) {
      setError("Recording and transcript are required");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Update sentiment if transcript was edited
      let sentiment = sentimentResult;
      if (transcriptionResult?.text !== transcript) {
        sentiment = await analyzeSentiment(transcript);
        setSentimentResult(sentiment);
      }
      
      // Create the journal entry
      await createEntry(
        recording,
        { text: transcript },
        sentiment || { sentiment: "neutral" },
        prompt?.text
      );
      
      // Reset state and notify parent
      resetState();
      onEntryCreated();
    } catch (err) {
      console.error("Error creating journal entry:", err);
      setError(err instanceof Error ? err.message : "Failed to create journal entry");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset state
  const resetState = () => {
    setStep("prompt");
    setRecording(null);
    setTranscript("");
    setTranscriptionResult(null);
    setSentimentResult(null);
    setPrompt(null);
    setError(null);
  };

  // Handle getting a new prompt
  const handleGetPrompt = async () => {
    return await getPrompt();
  };

  // Handle using a prompt
  const handleUsePrompt = (selectedPrompt: JournalPrompt) => {
    setPrompt(selectedPrompt);
    setStep("record");
  };

  // Handle skipping the prompt
  const handleSkipPrompt = () => {
    setPrompt(null);
    setStep("record");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Journal Entry</CardTitle>
      </CardHeader>
      <CardContent>
        {step === "prompt" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Would you like to use a prompt for your journal entry, or just start recording?
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleSkipPrompt}>
                Skip Prompt
              </Button>
              <Button onClick={() => handleGetPrompt().then(setPrompt).then(() => setStep("record"))}>
                Get a Prompt
              </Button>
            </div>
          </div>
        )}

        {step === "record" && (
          <div className="space-y-4">
            {prompt && (
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium">Your Prompt:</p>
                <p className="mt-1 italic">{prompt.text}</p>
              </div>
            )}
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm">Processing your recording...</p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            {prompt && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Prompt:</p>
                <p className="text-sm italic">{prompt.text}</p>
              </div>
            )}
            <div>
              <label htmlFor="transcript" className="text-sm font-medium">
                Transcript:
              </label>
              <Textarea
                id="transcript"
                value={transcript}
                onChange={handleTranscriptChange}
                className="mt-1 min-h-[150px]"
                placeholder="Your transcribed journal entry..."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                You can edit the transcript if needed.
              </p>
            </div>
            {sentimentResult && (
              <div>
                <p className="text-sm font-medium">Sentiment Analysis:</p>
                <p className="text-sm">
                  Your entry appears{" "}
                  <span className="font-medium">
                    {sentimentResult.sentiment === "positive"
                      ? "positive 😊"
                      : sentimentResult.sentiment === "negative"
                      ? "negative 😔"
                      : "neutral 😐"}
                  </span>
                </p>
                {sentimentResult.explanation && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {sentimentResult.explanation}
                  </p>
                )}
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}
      </CardContent>
      {step === "review" && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("record")} disabled={isProcessing}>
            Record Again
          </Button>
          <Button onClick={handleSubmit} disabled={!transcript || isProcessing}>
            {isProcessing ? "Saving..." : "Save Entry"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 