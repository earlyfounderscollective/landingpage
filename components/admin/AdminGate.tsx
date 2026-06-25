import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { AdminNav } from "./AdminNav";

/**
 * Wraps any admin page. Redirects to /admin/login if not signed in.
 * Renders the admin top nav around the page content if signed in.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-forest text-ivory relative">
        <div className="container-page py-4 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-[16px] tracking-tight">
            Early Founders · Admin
          </Link>
          <AdminNav />
        </div>
      </header>
      <main className="container-page py-8 md:py-12 px-4 md:px-0">{children}</main>
    </div>
  );
}
