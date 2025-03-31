"use client";

import { JournalEntry as JournalEntryType } from "@/types";
import { JournalEntry } from "@/components/journal/journal-entry";

interface JournalListProps {
  entries: JournalEntryType[];
  onDeleteEntry: (id: string) => void;
  isLoading?: boolean;
}

export function JournalList({ entries, onDeleteEntry, isLoading = false }: JournalListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-1/3 rounded bg-muted"></div>
              <div className="h-3 w-1/4 rounded bg-muted"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-muted"></div>
              <div className="h-3 w-full rounded bg-muted"></div>
              <div className="h-3 w-2/3 rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">No journal entries yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start recording to create your first journal entry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <JournalEntry key={entry.id} entry={entry} onDelete={onDeleteEntry} />
      ))}
    </div>
  );
} 