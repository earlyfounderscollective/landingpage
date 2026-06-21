import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";

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
      <header className="bg-forest text-ivory">
        <div className="container-page py-4 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-[16px] tracking-tight">
            Early Founders · Admin
          </Link>
          <nav className="flex items-center gap-6 text-[13px]">
            <Link href="/admin" className="hover:text-brass">
              Overview
            </Link>
            <Link href="/admin/training" className="hover:text-brass">
              Training
            </Link>
            <Link href="/admin/bootcamp" className="hover:text-brass">
              Bootcamp
            </Link>
            <Link href="/admin/applications" className="hover:text-brass">
              Applications
            </Link>
            <Link href="/admin/images" className="hover:text-brass">
              Images
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="hover:text-brass">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container-page py-10 md:py-12">{children}</main>
    </div>
  );
}
