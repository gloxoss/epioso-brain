"use client";

import { useState } from "react";
import { Badge, Card, CardContent, PageHeader } from "../../components/ui";

interface AuditReport {
  readonly id: string;
  readonly name: string;
  readonly dateGenerated: string;
  readonly category: "ROI & Spend" | "Code Quality" | "System Health" | "Content Performance";
  readonly status: "Approved" | "Staged" | "Draft" | "Failed";
  readonly findingsCount: number;
  readonly description: string;
}

const REPORTS_DATA: readonly AuditReport[] = [
  {
    id: "weekly-aios-audit",
    name: "Weekly AIOS Operations Audit - Week 22",
    dateGenerated: "2026-06-01",
    category: "System Health",
    status: "Approved",
    findingsCount: 2,
    description: "Evaluated 4C maturity metrics. Identified 1 stale workspace folder path and verified local database checksum.",
  },
  {
    id: "roi-spend-report-may",
    name: "Monthly ROI & Spend Report - May 2026",
    dateGenerated: "2026-05-31",
    category: "ROI & Spend",
    status: "Approved",
    findingsCount: 0,
    description: "Calculated active subscription cost ($115.00) vs. developer hours saved (44.5h), yielding $4,335.00 net ROI.",
  },
  {
    id: "codebase-health-audit",
    name: "Brain Web Codebase Health Check",
    dateGenerated: "2026-06-02",
    category: "Code Quality",
    status: "Staged",
    findingsCount: 3,
    description: "Monitored imports for local-only compliance. Verified TypeScript strict options and flagged 3 missing JSDocs.",
  },
  {
    id: "instagram-content-performance",
    name: "Instagram Editorial Brief Performance",
    dateGenerated: "2026-05-25",
    category: "Content Performance",
    status: "Draft",
    findingsCount: 1,
    description: "Evaluated post engagement and CTA conversions. Suggested highlighting resume vector matcher project outcomes.",
  },
];

export default function ReportsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredReports = REPORTS_DATA.filter((rep) => {
    const matchesCategory = categoryFilter === "All" || rep.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || rep.status === statusFilter;
    const matchesSearch =
      rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const statusColorMap = {
    Approved: "success" as const,
    Staged: "warning" as const,
    Draft: "neutral" as const,
    Failed: "danger" as const,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audits"
        title="Operations Reports"
        description="Review system-wide diagnostic audits, ROI compliance briefs, and local code-quality diagnostics."
        actions={
          <div className="flex gap-2">
            <Badge variant="private">Private Reports</Badge>
            <Badge variant="success">All Local</Badge>
          </div>
        }
      />

      {/* Audit stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border-neutral-200 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Audits Recorded
            </p>
            <div className="text-3xl font-bold text-neutral-900">{REPORTS_DATA.length}</div>
            <p className="text-xs text-neutral-500">Diagnostics logged since control plane setup.</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-soft-black border-brand-graphite text-white">
          <CardContent className="pt-6 space-y-2">
            <p className="text-xs font-semibold text-brand-muted-grey uppercase tracking-widest">
              Staged Findings
            </p>
            <div className="text-3xl font-extrabold text-white">
              {REPORTS_DATA.reduce((acc, r) => acc + (r.status === "Staged" ? r.findingsCount : 0), 0)} Pending
            </div>
            <p className="text-xs text-brand-muted-grey">
              Critical issues awaiting human-in-the-loop review.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-brand-warm-paper border-brand-muted-grey/20 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-brand-muted-grey uppercase tracking-wider">
              Maturity Index (4C)
            </p>
            <div className="text-3xl font-extrabold text-brand-orange">B+ (Ready)</div>
            <p className="text-xs text-brand-muted-grey">Overall context and capabilities score.</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls & Filters */}
      <div className="grid gap-3 p-4 rounded-lg border border-neutral-200 bg-white md:grid-cols-4 items-center">
        <div>
          <label htmlFor="rep-search" className="block text-xs font-bold text-neutral-500 uppercase mb-1">Search Audits</label>
          <input
            id="rep-search"
            type="text"
            placeholder="e.g. Weekly, May"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 px-3 rounded border border-neutral-300 text-sm focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Category</label>
          <div className="flex gap-1">
            {["All", "System Health", "ROI & Spend", "Code Quality"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`h-8 px-2.5 rounded text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  categoryFilter === cat
                    ? "bg-brand-orange border-brand-orange text-white"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {cat === "System Health" ? "System" : cat === "ROI & Spend" ? "ROI" : cat === "Code Quality" ? "Code" : cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Audit Status</label>
          <div className="flex gap-1">
            {["All", "Approved", "Staged", "Draft"].map((stat) => (
              <button
                key={stat}
                onClick={() => setStatusFilter(stat)}
                className={`h-8 px-3 rounded text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  statusFilter === stat
                    ? "bg-brand-orange border-brand-orange text-white"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-5 md:pt-0">
          <button className="h-8 rounded bg-brand-soft-black hover:bg-brand-graphite px-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors">
            Trigger Audit Run
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3 bg-neutral-50/50">
          <p className="text-sm font-semibold text-neutral-950">Audit Reports Ledger</p>
          <p className="mt-1 text-sm text-neutral-600">
            System diagnostics generated by local adapters.
          </p>
        </div>

        {filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 font-semibold">
                <tr>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Report Name</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Category</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Date Logged</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Issues Found</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Audit Status</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-neutral-50/40">
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <div>
                        <p className="font-semibold text-neutral-950">{rep.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{rep.description}</p>
                      </div>
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <span className="inline-block rounded bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                        {rep.category}
                      </span>
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 text-neutral-600 text-xs font-mono">
                      {rep.dateGenerated}
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 text-neutral-700 font-medium">
                      {rep.findingsCount > 0 ? (
                        <span className="text-amber-600 font-semibold">{rep.findingsCount} findings</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">Clean</span>
                      )}
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <Badge variant={statusColorMap[rep.status]}>{rep.status}</Badge>
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 text-right space-x-1.5">
                      <button className="inline-flex h-7 items-center rounded border border-neutral-300 bg-white px-2.5 text-xs font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 text-sm">
            No audit reports match the active filter configurations.
          </div>
        )}
      </div>

      {/* Progress panel representing staged audit checklist */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border-neutral-200">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-950">Active Audit Rules</p>
          </div>
          <CardContent className="space-y-3 pt-3 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="font-semibold text-neutral-800">Rule 1: Local Data Bound</span>
              <span className="text-emerald-600 font-semibold">Active</span>
            </div>
            <p className="text-neutral-500">Scans must confirm that credentials and database files stay on this machine.</p>

            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="font-semibold text-neutral-800">Rule 2: Medical Compliance Gate</span>
              <span className="text-emerald-600 font-semibold">Active</span>
            </div>
            <p className="text-neutral-500">Flags any medical model integration without a standard Concept / Proof disclosure badge.</p>

            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="font-semibold text-neutral-800">Rule 3: TypeScript Strict Check</span>
              <span className="text-emerald-600 font-semibold">Active</span>
            </div>
            <p className="text-neutral-500">Verifies strict typing on compile tasks. No implicit 'any' allowed.</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-warm-paper border-brand-muted-grey/20 text-neutral-900">
          <div className="border-b border-brand-muted-grey/10 px-4 py-3">
            <p className="text-sm font-bold text-neutral-950 uppercase tracking-wider text-xs">Staged Findings Feed</p>
          </div>
          <CardContent className="space-y-3 pt-3 text-xs">
            <div className="p-3 bg-brand-paper-soft rounded border border-brand-muted-grey/10">
              <div className="flex items-center justify-between font-bold text-neutral-950 mb-1">
                <span>Code Quality (Staged)</span>
                <span className="text-brand-orange">Today</span>
              </div>
              <p className="text-neutral-600">
                Found 3 dynamic routes missing custom page metadata structures.
              </p>
            </div>

            <div className="p-3 bg-brand-paper-soft rounded border border-brand-muted-grey/10">
              <div className="flex items-center justify-between font-bold text-neutral-950 mb-1">
                <span>System Health (Approved)</span>
                <span>Yesterday</span>
              </div>
              <p className="text-neutral-600">
                Successfully pruned 12 unused agent session log nodes. Saved 14MB local SQLite space.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
