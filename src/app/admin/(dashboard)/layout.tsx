import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative auth check. proxy.ts already redirects unauthenticated
  // requests before they reach here, but every protected Server Component
  // must independently verify the session — proxy matchers can silently
  // stop covering a route after a refactor, so this is the real guard.
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-cream-soft">
      <AdminSidebar adminName={session.name} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminTopbar adminName={session.name} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
