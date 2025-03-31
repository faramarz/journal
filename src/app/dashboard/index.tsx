import { Profile } from "@/types";

interface JournalDashboardProps {
  user: Profile;
}

export function JournalDashboard({ user }: JournalDashboardProps) {
  return (
    <main className="flex-1">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome back, {user.full_name || 'there'}!</h1>
        <div className="grid gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Journal Entries</h2>
            <p className="text-muted-foreground">No entries yet. Start recording your thoughts!</p>
          </div>
        </div>
      </div>
    </main>
  );
} 