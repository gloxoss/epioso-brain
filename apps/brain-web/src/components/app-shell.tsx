"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

import { cn } from "../lib/class-names";
import { dashboardNavigation, shellStatus } from "../lib/navigation";
import { Badge, Button } from "./ui";

export interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string>(shellStatus.refreshReadyLabel);

  const currentSection = useMemo(() => {
    return (
      dashboardNavigation.find((item) =>
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
      ) ?? dashboardNavigation[0]
    );
  }, [pathname]);

  function requestRefresh() {
    setRefreshStatus(shellStatus.refreshRequestedLabel);
  }

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-orange selection:text-black">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-neutral-800 bg-brand-black-soft lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} onNavigate={() => undefined} />
      </aside>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-neutral-950/60"
            onClick={() => setIsMobileNavOpen(false)}
            type="button"
          />
          <aside
            className="relative flex h-full w-80 max-w-[86vw] flex-col border-r border-neutral-800 bg-brand-black-soft shadow-xl"
            id="mobile-navigation"
          >
            <SidebarContent pathname={pathname} onNavigate={() => setIsMobileNavOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-neutral-800 bg-brand-black-soft/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between lg:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                aria-controls="mobile-navigation"
                aria-expanded={isMobileNavOpen}
                className="lg:hidden border-neutral-800 hover:border-neutral-700"
                onClick={() => setIsMobileNavOpen(true)}
                size="sm"
                variant="secondary"
              >
                Menu
              </Button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {currentSection.label}
                </p>
                <p className="truncate text-xs text-neutral-400">{currentSection.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="private">{shellStatus.workspaceBadge}</Badge>
              <Badge variant="neutral">{shellStatus.lastScanLabel}</Badge>
              <Badge variant="warning">{shellStatus.reviewCountLabel}</Badge>
              <Button onClick={requestRefresh} size="sm" variant="secondary" className="border-neutral-800 hover:border-neutral-700">
                Refresh
              </Button>
              <span className="text-xs text-neutral-400" role="status">
                {refreshStatus}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  readonly pathname: string;
  readonly onNavigate: () => void;
}

function SidebarContent({ onNavigate, pathname }: SidebarContentProps) {
  return (
    <>
      <div className="border-b border-neutral-800 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">Local brain</p>
        <p className="mt-1 text-xl font-bold tracking-tight text-white">EPIOSO Brain</p>
        <p className="mt-2 text-sm leading-5 text-neutral-400">
          Private studio operations, scans, sessions, and approvals.
        </p>
      </div>
      <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {dashboardNavigation.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "block rounded-md border px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "border-brand-orange/30 bg-brand-orange/10 text-brand-orange"
                  : "border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900 hover:text-white",
              )}
              href={item.href}
              key={item.key}
              onClick={onNavigate}
            >
              <span className="font-medium">{item.label}</span>
              <span className="mt-1 block text-xs leading-5 text-neutral-500">
                {item.description}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-neutral-800 px-5 py-4">
        <p className="text-xs font-medium text-neutral-400">Local-only mode</p>
        <p className="mt-1 text-xs leading-5 text-neutral-500">
          Writes and external actions will require review before they run.
        </p>
      </div>
    </>
  );
}
