import { getWorkoutById } from "@hyrox/shared";
import { AppShell } from "../../../components/app-shell";
import { WorkoutRoute } from "../../../components/workout-route";

export default async function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workout = getWorkoutById(id);

  return (
    <AppShell>
      <WorkoutRoute workoutId={id} initialWorkout={workout ?? null} />
    </AppShell>
  );
}
