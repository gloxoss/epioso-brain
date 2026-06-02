"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  PageHeader,
  type DataTableColumn,
} from "../../components/ui";
import { mockSkills, type Skill } from "../../lib/intelligence-mock-data";

export default function SkillsPage() {
  const [skills, setSkills] = useState<readonly Skill[]>(mockSkills);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalSkills = skills.length;
  const staleSkillsCount = skills.filter((s) => s.stale).length;
  const usedThisWeek = skills.filter((s) => {
    const lastUsed = new Date(s.lastUsed);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return lastUsed > oneWeekAgo;
  }).length;
  const duplicateNamesCount = skills.filter((s) => s.duplicate).length;

  const handleRunScan = () => {
    setIsScanning(true);
    setScanProgress(10);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Add a mock skill to simulate scanner finding new things
          setSkills((current) => {
            if (current.some((s) => s.id === "sk-09")) return current;
            return [
              ...current,
              {
                id: "sk-09",
                name: "epioso-ops-log-cleaner",
                description: "Scrapes and truncates local session log files older than 90 days to free up block storage.",
                category: "Ops",
                lastUsed: new Date().toISOString(),
                usageCount: 1,
                path: "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain/.skills/log-cleaner.md",
                stale: false,
                hoursSaved: 2,
                type: "Script",
              },
            ];
          });
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const handleMarkReviewed = (id: string) => {
    setSkills((current) =>
      current.map((s) => (s.id === id ? { ...s, stale: false, lastUsed: new Date().toISOString() } : s)),
    );
  };

  const handleCopyPath = (id: string, path: string) => {
    navigator.clipboard.writeText(path).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const categoryTones = {
    Agency: "info",
    Content: "warning",
    Logic: "success",
    Ops: "neutral",
  } as const;

  const skillColumns: readonly DataTableColumn<Skill>[] = [
    {
      key: "name",
      header: "Skill",
      render: (row) => (
        <div>
          <span className="font-mono text-sm font-semibold text-neutral-950">{row.name}</span>
          {row.duplicate && (
            <span className="ml-2 inline-flex items-center rounded-sm bg-amber-100 px-1 text-[10px] font-medium text-amber-800">
              DUPLICATE
            </span>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => <Badge variant={categoryTones[row.category]}>{row.category}</Badge>,
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
          {row.type}
        </span>
      ),
    },
    {
      key: "lastUsed",
      header: "Last Active",
      render: (row) => <span className="text-xs text-neutral-600">{new Date(row.lastUsed).toLocaleDateString()}</span>,
    },
    {
      key: "usageCount",
      header: "Usage",
      align: "right",
      render: (row) => <span className="font-mono text-neutral-900">{row.usageCount}</span>,
    },
    {
      key: "path",
      header: "Path & Action",
      render: (row) => (
        <div className="flex items-center gap-2">
          <code className="block max-w-[200px] truncate font-mono text-xs text-neutral-500" title={row.path}>
            {row.path}
          </code>
          <Button size="sm" variant="secondary" className="h-7 px-2" onClick={() => handleCopyPath(row.id, row.path)}>
            {copiedId === row.id ? "Copied" : "Copy"}
          </Button>
        </div>
      ),
    },
    {
      key: "stale",
      header: "Status",
      render: (row) =>
        row.stale ? (
          <Badge variant="warning">Stale (30d+)</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        ),
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        description="Scanned local capabilities, frontmatter tags, duplicate detections, and stale review workflows."
        eyebrow="LOCAL AGENT TOOLING"
        title="Skills"
        actions={
          <Button onClick={handleRunScan} isLoading={isScanning} loadingLabel="Scanning .codex & .agents...">
            Run Skill Scan
          </Button>
        }
      />

      {isScanning && (
        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#FF6B2D] h-full transition-all duration-300"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      )}

      {/* KPI metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Skills</p>
            <p className="text-3xl font-bold text-neutral-900">{totalSkills}</p>
            <p className="text-xs text-neutral-500">Scanned in workspace</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Stale 30+ Days</p>
            <p className="text-3xl font-bold text-amber-600">{staleSkillsCount}</p>
            <p className="text-xs text-neutral-500">Needs review & update</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Used This Week</p>
            <p className="text-3xl font-bold text-emerald-600">{usedThisWeek}</p>
            <p className="text-xs text-neutral-500">Active agent loops</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Duplicate Names</p>
            <p className="text-3xl font-bold text-rose-600">{duplicateNamesCount}</p>
            <p className="text-xs text-neutral-500">Refactoring required</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main inventory table */}
        <div className="space-y-4">
          <DataTable
            caption="Scanned Local Skills"
            description="Capabilities parsed from .skills folder. Monospace paths point to markdown source files."
            columns={skillColumns}
            rows={skills}
            getRowKey={(row) => row.id}
          />
        </div>

        {/* Side panel: Stale Review Queue */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Stale Review Queue</CardTitle>
            <CardDescription>
              Skills unused for 30+ days. Outdated instructions can lead to low quality AI outputs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.filter((s) => s.stale).length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {skills
                  .filter((s) => s.stale)
                  .map((s) => (
                    <div key={s.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-neutral-900">{s.name}</span>
                        <Badge variant="warning">Stale</Badge>
                      </div>
                      <p className="text-xs text-neutral-600 leading-normal">{s.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary" className="h-7 text-xs bg-[#FF6B2D] hover:bg-[#E85A1F] border-[#FF6B2D]" onClick={() => handleMarkReviewed(s.id)}>
                          Mark Reviewed
                        </Button>
                        <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => handleCopyPath(s.id, s.path)}>
                          Copy Path
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 py-2">All scanned skills are fresh and active!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
