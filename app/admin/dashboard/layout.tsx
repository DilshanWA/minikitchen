import Sidebar from "@/app/admin/components/Sidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connection } from "next/server"

export const instant = false

export default async function DashboardLayout({
  children,
}: LayoutProps<"/admin/dashboard">) {
  await connection()

  const user = await getCurrentUser()
  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 md:ml-64 text-black">
        
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}



/*
import { signOut } from "@/app/actions/auth";
import { requireAuth } from "@/lib/auth";

export const instant = false;

export default async function DashboardLayout({ children }: LayoutProps<"/admin/dashboard">) {
  const user = await requireAuth();

  return (
    <div>
      <header>
        <span>{user.email}</span>
        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </header>
      {children}
    </div>
  );
*/