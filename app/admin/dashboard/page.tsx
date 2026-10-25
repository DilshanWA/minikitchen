import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}.</p>
      <p>Your authenticated user ID: {user.id}</p>
    </main>
  );
}