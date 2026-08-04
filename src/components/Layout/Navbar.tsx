"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Upload, LayoutDashboard } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--ds-bg-base)]/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card">
            <Activity className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {APP_NAME}
            </span>
            <span className="hidden sm:block text-label-xs">
              Customer Health Intelligence
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  isActive ? "ds-btn-ghost-active" : "ds-btn-ghost"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
