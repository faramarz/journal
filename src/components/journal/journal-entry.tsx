"use client";

import { useState } from "react";
import { formatDistanceToNow } from "@/lib/utils";
import { JournalEntry as JournalEntryType } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Play, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface JournalEntryProps {
  entry: JournalEntryType;
  onDelete: (id: string) => void;
}

export function JournalEntry({ entry, onDelete }: JournalEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Format date for display
  const formattedDate = new Date(entry.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get time ago
  const timeAgo = formatDistanceToNow(new Date(entry.created_at));

  // Format transcript for display
  const formatTranscript = () => {
    if (!entry.transcript) return "No transcript available";
    
    if (isExpanded) {
      return entry.transcript;
    }
    
    return entry.transcript.length > 180
      ? `${entry.transcript.substring(0, 180)}...`
      : entry.transcript;
  };

  // Get sentiment color
  const getSentimentColor = () => {
    if (!entry.sentiment) return "bg-gray-200";
    
    switch (entry.sentiment.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-700";
      case "negative":
        return "bg-red-100 text-red-700";
      case "neutral":
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // Handle delete
  const handleDelete = () => {
    onDelete(entry.id);
    setIsConfirmingDelete(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{entry.title || formattedDate}</CardTitle>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-2">
        <div className="space-y-2">
          {entry.prompt_used && (
            <div className="rounded bg-muted p-2 text-sm italic">
              Prompt: {entry.prompt_used}
            </div>
          )}
          <p className="text-sm leading-relaxed">{formatTranscript()}</p>
          {entry.transcript && entry.transcript.length > 180 && (
            <Button
              variant="link"
              className="h-auto p-0 text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex gap-1">
          {entry.sentiment && (
            <span className={`rounded-full px-2 py-0.5 text-xs ${getSentimentColor()}`}>
              {entry.sentiment}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {entry.audio_url && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Play className="mr-1 h-3 w-3" />
                  Play
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{entry.title || formattedDate}</DialogTitle>
                  <DialogDescription>Recording from {formattedDate}</DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                  <audio src={entry.audio_url} controls className="w-full" />
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-red-500">
                <Trash className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Journal Entry</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this journal entry? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
} 