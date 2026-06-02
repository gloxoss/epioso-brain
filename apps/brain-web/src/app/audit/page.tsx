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
import {
  mockFourCAudit,
  mockOperatingBuckets,
  mockLintFindings,
  type OperatingBucket,
  type LintFinding,
} from "../../lib/intelligence-mock-data";

export default function AuditPage() {
  const [audit, setAudit] = useState(mockFourCAudit);
  const [buckets, setBuckets] = useState<readonly OperatingBucket[]>(mockOperatingBuckets);
  const [findings, setFindings] = useState<readonly LintFinding[]>(mockLintFindings);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditProgress(10);
    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          // Simulate audit improvement / update
          setAudit({
            overallReadiness: 68,
            contextScore: 85,
            connectionsScore: 60,
            capabilitiesScore: 72,
            cadenceScore: 55,
          });
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const handleFixFinding = (id: string) => {
    setFindings((current) => current.filter((f) => f.id !== id));
    // Update parent metrics
    setBuckets((current) =>
      current.map((b) =>
        b.id === "bucket-know"
          ? { ...b, auditFindingsCount: Math.max(0, b.auditFindingsCount - 1), contextScore: Math.min(100, b.contextScore + 2) }
          : b
      )
    );
  };

  const severityBadgeTones = {
    critical: "danger",
    warning: "warning",
    info: "neutral",
  } as const;

  const findingsColumns: readonly DataTableColumn<LintFinding>[] = [
    {
      key: "pageTitle",
      header: "Context Area",
      render: (row) => <span className="font-semibold text-neutral-900">{row.pageTitle}</span>,
    },
    {
      key: "severity",
      header: "Severity",
      render: (row) => <Badge variant={severityBadgeTones[row.severity]}>{row.severity.toUpperCase()}</Badge>,
    },
    {
      key: "message",
      header: "Finding details",
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => handleFixFinding(row.id)}>
            Mark Fixed
          </Button>
          <Button size="sm" variant="subtle" className="h-7 text-xs text-[#FF6B2D]" onClick={() => alert("Converting to developer task...")}>
            Make Task
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        description="Calculates local readiness scorecards using the 4C framework. Audits gaps in connected workspace systems."
        eyebrow="CONTEXT / CONNECTIONS / CAPABILITIES / CADENCE"
        title="AIOS Audit"
        actions={
          <Button onClick={handleRunAudit} isLoading={isAuditing} loadingLabel="Running 4C scanner...">
            Run Audit Scan
          </Button>
        }
      />

      {isAuditing && (
        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#FF6B2D] h-full transition-all duration-300"
            style={{ width: `${auditProgress}%` }}
          />
        </div>
      )}

      {/* 4C KPI Scorecards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-[#EDE8E4] border-neutral-350 text-neutral-900">
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Readiness Score</p>
            <p className="text-3xl font-extrabold text-[#FF6B2D]">{audit.overallReadiness}%</p>
            <p className="text-xs text-neutral-600">Total operational maturity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Context Score</p>
            <p className="text-3xl font-bold text-neutral-900">{audit.contextScore}%</p>
            <p className="text-xs text-neutral-500">Wiki notes & prompts health</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Connections</p>
            <p className="text-3xl font-bold text-neutral-900">{audit.connectionsScore}%</p>
            <p className="text-xs text-neutral-500">Active folder & API links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Capabilities</p>
            <p className="text-3xl font-bold text-neutral-900">{audit.capabilitiesScore}%</p>
            <p className="text-xs text-neutral-500">Available agent skills & SOPs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Cadence Score</p>
            <p className="text-3xl font-bold text-neutral-900">{audit.cadenceScore}%</p>
            <p className="text-xs text-neutral-500">Scheduled reports & loops</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left Side: Score Matrix */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>4C Score Matrix by Bucket</CardTitle>
              <CardDescription>Seven operating buckets evaluated across the 4C framework.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 text-left uppercase">
                      <th className="py-2">Bucket</th>
                      <th className="py-2 text-center">Context</th>
                      <th className="py-2 text-center">Connections</th>
                      <th className="py-2 text-center">Capabilities</th>
                      <th className="py-2 text-center">Cadence</th>
                      <th className="py-2 text-right">Findings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {buckets.map((b) => (
                      <tr key={b.id} className="text-neutral-700 hover:bg-neutral-50/50">
                        <td className="py-3 font-sans font-bold text-neutral-900">{b.name}</td>
                        <td className="py-3 text-center">
                          <span className={b.contextScore >= 80 ? "text-emerald-600 font-bold" : "text-amber-600"}>
                            {b.contextScore}%
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={b.connectionsScore >= 80 ? "text-emerald-600 font-bold" : b.connectionsScore < 40 ? "text-rose-600" : "text-amber-600"}>
                            {b.connectionsScore}%
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={b.capabilitiesScore >= 80 ? "text-emerald-600 font-bold" : "text-amber-600"}>
                            {b.capabilitiesScore}%
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={b.cadenceScore >= 80 ? "text-emerald-600 font-bold" : b.cadenceScore < 40 ? "text-rose-600" : "text-amber-600"}>
                            {b.cadenceScore}%
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {b.auditFindingsCount > 0 ? (
                            <Badge variant="warning">{b.auditFindingsCount} open</Badge>
                          ) : (
                            <Badge variant="success">0 issues</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <DataTable
            caption="Audit Findings Queue"
            description="System lints requiring developer correction or credential rotations."
            columns={findingsColumns}
            rows={findings}
            getRowKey={(row) => row.id}
          />
        </div>

        {/* Right Side: Recommended Fixes */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Recommended Fixes</CardTitle>
            <CardDescription>Implement these changes to increase overall 4C score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 text-xs">
              <div className="border border-neutral-200 p-3 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-900">1. Setup Communications Cron</span>
                  <Badge variant="danger">High Impact</Badge>
                </div>
                <p className="text-neutral-600 leading-normal">
                  Add n8n trigger to check Slack channels every 4 hours. Increases Cadence score by +8%.
                </p>
                <Button size="sm" className="w-full bg-[#FF6B2D] hover:bg-[#E85A1F] border-[#FF6B2D]" onClick={() => alert("Staging cadence task...")}>
                  Fix Cadence
                </Button>
              </div>

              <div className="border border-neutral-200 p-3 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-900">2. Resolve Wiki Stale Warnings</span>
                  <Badge variant="warning">Medium</Badge>
                </div>
                <p className="text-neutral-600 leading-normal">
                  Review MediCore Healthcare files in Obsidian context directory. Restores Context score.
                </p>
                <Button size="sm" variant="secondary" className="w-full" onClick={() => alert("Routing to wiki index...")}>
                  Go to Wiki
                </Button>
              </div>

              <div className="border border-neutral-200 p-3 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-900">3. Connect Google Calendar</span>
                  <Badge variant="neutral">Connector</Badge>
                </div>
                <p className="text-neutral-600 leading-normal">
                  Link developer calendar API connector to pull focus slots. Boosts Connections.
                </p>
                <Button size="sm" variant="secondary" className="w-full" onClick={() => alert("Opening connectors screen...")}>
                  Connect API
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
