"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JournalPrompt as JournalPromptType } from "@/types";

interface JournalPromptProps {
  initialPrompt?: JournalPromptType;
  onGetNewPrompt: () => Promise<JournalPromptType>;
  onUsePrompt: (prompt: JournalPromptType) => void;
}

export function JournalPrompt({
  initialPrompt,
  onGetNewPrompt,
  onUsePrompt,
}: JournalPromptProps) {
  const [prompt, setPrompt] = useState<JournalPromptType | null>(initialPrompt || null);
  const [isLoading, setIsLoading] = useState(!initialPrompt);

  // Fetch initial prompt if not provided
  useEffect(() => {
    if (!initialPrompt && !prompt) {
      fetchNewPrompt();
    }
  }, [initialPrompt]);

  // Get a new prompt
  const fetchNewPrompt = async () => {
    try {
      setIsLoading(true);
      const newPrompt = await onGetNewPrompt();
      setPrompt(newPrompt);
    } catch (error) {
      console.error("Error fetching prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use the prompt
  const handleUsePrompt = () => {
    if (prompt) {
      onUsePrompt(prompt);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Prompt</CardTitle>
        <CardDescription>
          {prompt?.category ? `Category: ${prompt.category}` : "Journal inspiration for today"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-full rounded bg-muted"></div>
              <div className="h-4 w-5/6 rounded bg-muted"></div>
              <div className="h-4 w-4/6 rounded bg-muted"></div>
            </div>
          ) : (
            <blockquote className="border-l-2 pl-4 italic">
              {prompt?.text || "What's on your mind today?"}
            </blockquote>
          )}
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={fetchNewPrompt} disabled={isLoading}>
              {isLoading ? "Loading..." : "New Prompt"}
            </Button>
            <Button size="sm" onClick={handleUsePrompt} disabled={isLoading || !prompt}>
              Use This Prompt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 