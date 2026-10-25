import Link from "next/link";
import { ArrowUpRight, CalendarDays, ChefHat, Mail, UserRound } from "lucide-react";
import { requireAuth } from "@/lib/auth";

const dashboardLinks = [
  {
    href: "/admin/dashboard/reservations",
    title: "Reservations",
    description: "View and manage upcoming table bookings.",
    icon: CalendarDays,
  },
  {
    href: "/admin/dashboard/menuitems",
    title: "Menu items",
    description: "Add dishes and keep your menu up to date.",
    icon: ChefHat,
  },
];

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main className="mx-auto max-w-5xl">
      <header className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
          Admin workspace
        </p>
        <p className="text-3xl font-semibold tracking-tight text-gray-900">
          Welcome back, {user.name}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Keep your restaurant running smoothly from one place.
        </p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2" aria-label="Dashboard shortcuts">
        {dashboardLinks.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
          >
            <div className="mb-8 flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-gray-100 text-gray-700">
                <Icon size={19} />
              </span>
              <ArrowUpRight
                size={18}
                className="text-gray-400 transition group-hover:text-gray-900"
              />
            </div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-50 text-orange-600">
            <UserRound size={17} />
          </span>
          <div>
            <p className="font-semibold text-gray-900">Account details</p>
            <p className="text-xs text-gray-500">Your administrator profile</p>
          </div>
        </div>
        <div className="grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Role</p>
            <p className="mt-1 text-sm font-medium capitalize text-gray-900">{user.role}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
