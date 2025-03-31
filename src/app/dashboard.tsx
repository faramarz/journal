"use client";

import { useState } from "react";
import { Profile } from "@/types";
import { JournalCreator } from "@/components/journal/journal-creator";
import { JournalList } from "@/components/journal/journal-list";
import { JournalPrompt } from "@/components/journal/journal-prompt";
import { useJournal } from "@/hooks/use-journal";
import { toast } from "sonner";

interface JournalDashboardProps {
  user: Profile;
}

export function JournalDashboard({ user }: JournalDashboardProps) {
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);
  const { entries, isLoading, error, fetchEntries, deleteEntry, getPrompt } = useJournal();

  const handleEntryCreated = () => {
    setIsCreatingEntry(false);
    toast.success("Journal entry created successfully!");
    fetchEntries();
  };

  const handleDeleteEntry = async (entryId: string) => {
    await deleteEntry(entryId);
    toast.success("Journal entry deleted successfully!");
  };

  const handleCreateNewEntry = () => {
    setIsCreatingEntry(true);
  };

  const handleUsePrompt = () => {
    setIsCreatingEntry(true);
  };

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {isCreatingEntry ? "New Journal Entry" : "Your Journal"}
          </h1>
          {!isCreatingEntry && (
            <button
              onClick={handleCreateNewEntry}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              New Entry
            </button>
          )}
        </div>

        {isCreatingEntry ? (
          <JournalCreator onEntryCreated={handleEntryCreated} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <JournalList
                entries={entries}
                onDeleteEntry={handleDeleteEntry}
                isLoading={isLoading}
              />
              {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
            <div className="space-y-6">
              <JournalPrompt
                onGetNewPrompt={getPrompt}
                onUsePrompt={handleUsePrompt}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 