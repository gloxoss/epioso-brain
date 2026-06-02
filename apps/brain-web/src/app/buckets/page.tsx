"use client";

import { useState } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Button, PageHeader } from "../../components/ui";
import { mockOperatingBuckets, mockCadenceJobs } from "../../lib/intelligence-mock-data";

interface Connector {
  readonly name: string;
  readonly type: string;
  readonly status: "Active" | "Missing" | "Staged";
}

const CONNECTORS_DATA: Record<string, readonly Connector[]> = {
  "Revenue": [
    { name: "epioso-agency-invoice-generator", type: "Script", status: "Active" },
    { name: "Stripe API Adapter", type: "API", status: "Missing" },
  ],
  "Customers & Leads": [
    { name: "Obsidian Leads Vault", type: "Obsidian", status: "Active" },
    { name: "Local Workspace DB", type: "Database", status: "Active" },
  ],
  "Calendar & Schedule": [
    { name: "Google Calendar API", type: "API", status: "Staged" },
  ],
  "Communications": [
    { name: "Slack Webhook (n8n)", type: "Webhook", status: "Active" },
    { name: "Gmail API Sync", type: "API", status: "Missing" },
    { name: "WhatsApp Business Client", type: "Chat", status: "Missing" },
  ],
  "Tasks": [
    { name: "Nx Workspace Engine", type: "Runner", status: "Active" },
    { name: "npx skills checker", type: "Script", status: "Active" },
    { name: "Agent Log Folder", type: "Directory", status: "Active" },
  ],
  "Meetings": [
    { name: "Whisper Audio Uploader", type: "API", status: "Active" },
    { name: "Obsidian Meeting Notes", type: "Folder", status: "Active" },
  ],
  "Knowledge": [
    { name: "Roadmap Obsidian Vault", type: "Obsidian", status: "Active" },
    { name: "Local Skill Files", type: "Directory", status: "Active" },
    { name: "Wiki Markdown Folder", type: "Directory", status: "Active" },
  ],
};

const SUGGESTED_CONNECTORS = [
  { id: "sug-1", name: "Stripe Billing Adapter", type: "Revenue Tracker", difficulty: "Easy", reason: "Automate accounting milestones logs." },
  { id: "sug-2", name: "Gmail IMAP Scanner", type: "Comms Linker", difficulty: "Medium", reason: "Parse client incoming scoping requests automatically." },
  { id: "sug-3", name: "WhatsApp Business webhook", type: "Comms Linker", difficulty: "Hard", reason: "Real-time Darija lead chat capturing." },
];

export default function OperatingBucketsPage() {
  const buckets = mockOperatingBuckets;
  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);

  // Overall calculations
  const totalBuckets = buckets.length;
  const averageMaturity = Math.round(
    buckets.reduce((sum, b) => sum + (b.contextScore + b.connectionsScore + b.capabilitiesScore + b.cadenceScore) / 4, 0) / totalBuckets
  );
  
  const totalCapabilities = buckets.reduce((sum, b) => sum + b.activeCapabilities.length, 0);
  const totalCadenceJobs = mockCadenceJobs.length;
  const totalFindings = buckets.reduce((sum, b) => sum + b.auditFindingsCount, 0);

  const activeBucket = buckets.find(b => b.id === selectedBucketId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="AgentOS AIOS Foundation"
        title="Operating Buckets Map"
        description="Verify coverage score ratios across the seven core business operating axes. Monitor 4C scores (Context, Connections, Capabilities, Cadence) to maximize AI-driven leverage."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" className="border-neutral-800 text-white" onClick={() => alert("Re-running 4C system compliance audit...")}>
              Run 4C System Audit
            </Button>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Buckets Covered</p>
            <p className="text-2xl font-bold text-white">{totalBuckets} / 7</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Maturity Score</p>
            <p className="text-2xl font-bold text-brand-orange">{averageMaturity}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Active Capabilities</p>
            <p className="text-2xl font-bold text-white">{totalCapabilities}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Cadence Jobs</p>
            <p className="text-2xl font-bold text-white">{totalCadenceJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Audit Findings</p>
            <p className={`text-2xl font-bold ${totalFindings > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {totalFindings} issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Label Eyebrow Strip */}
      <div className="border-b border-neutral-800 pb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          REVENUE / CUSTOMERS / CALENDAR / COMMS / TASKS / MEETINGS / KNOWLEDGE
        </p>
      </div>

      {/* Grid: 7 Bucket Cards & Right Suggestions panel */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        
        {/* Bucket Cards Column */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {buckets.map((bucket) => {
              const overallScore = Math.round(
                (bucket.contextScore + bucket.connectionsScore + bucket.capabilitiesScore + bucket.cadenceScore) / 4
              );
              
              const isSelected = bucket.id === selectedBucketId;

              return (
                <Card
                  key={bucket.id}
                  className={`cursor-pointer transition-all hover:border-brand-orange/20 ${
                    isSelected ? "border-brand-orange bg-brand-black-soft" : "border-neutral-800"
                  }`}
                  onClick={() => setSelectedBucketId(bucket.id)}
                >
                  <CardContent className="pt-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">{bucket.name}</h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{bucket.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-bold text-brand-orange">{overallScore}%</span>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500">Maturity</span>
                      </div>
                    </div>

                    {/* 4C Mini Scores */}
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-mono border-t border-neutral-800/60 pt-3">
                      <div className="flex flex-col items-center p-1 rounded bg-neutral-900/50">
                        <span className="text-neutral-500">Ctx</span>
                        <span className="font-bold text-neutral-200 mt-0.5">{bucket.contextScore}%</span>
                      </div>
                      <div className="flex flex-col items-center p-1 rounded bg-neutral-900/50">
                        <span className="text-neutral-500">Conn</span>
                        <span className={`font-bold mt-0.5 ${bucket.connectionsScore < 50 ? "text-amber-400" : "text-neutral-200"}`}>
                          {bucket.connectionsScore}%
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-1 rounded bg-neutral-900/50">
                        <span className="text-neutral-500">Cap</span>
                        <span className="font-bold text-neutral-200 mt-0.5">{bucket.capabilitiesScore}%</span>
                      </div>
                      <div className="flex flex-col items-center p-1 rounded bg-neutral-900/50">
                        <span className="text-neutral-500">Cad</span>
                        <span className={`font-bold mt-0.5 ${bucket.cadenceScore < 50 ? "text-brand-orange" : "text-neutral-200"}`}>
                          {bucket.cadenceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-neutral-850 pt-2.5">
                      <span className="text-neutral-500">Findings: {bucket.auditFindingsCount}</span>
                      <button
                        className="text-brand-orange font-semibold hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBucketId(bucket.id);
                        }}
                      >
                        Inspect Bucket &rarr;
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar panel: Biggest Missing Sources & Suggested Connectors */}
        <div className="space-y-4">
          <div className="border-b border-neutral-800 pb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">AIOS Coverage Gaps</p>
          </div>

          <div className="space-y-4">
            {SUGGESTED_CONNECTORS.map((sug) => (
              <Card key={sug.id} className="bg-brand-paper border-brand-light-grey text-neutral-900 shadow-sm">
                <CardContent className="pt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded bg-amber-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800">
                      Missing Connector
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500 font-mono">Difficulty: {sug.difficulty}</span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-950">{sug.name}</h4>
                  <p className="leading-relaxed text-neutral-700">{sug.reason}</p>
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-black font-bold h-7"
                      onClick={() => alert("Creating connection task draft for: " + sug.name)}
                    >
                      Queue Scaffolder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>

      {/* Selected Bucket Detail Inspector (Render if a bucket is clicked) */}
      {activeBucket && (
        <Card className="mt-6 border-brand-orange/30">
          <CardHeader className="bg-neutral-900/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white text-base">Bucket Detail: {activeBucket.name}</CardTitle>
              <p className="text-xs text-neutral-400 mt-1">{activeBucket.description}</p>
            </div>
            <Button variant="secondary" size="sm" className="text-neutral-400 hover:text-white" onClick={() => setSelectedBucketId(null)}>
              Close Inspector
            </Button>
          </CardHeader>
          <CardContent className="pt-5 space-y-5 text-sm">
            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Connected Data Sources */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange border-b border-neutral-850 pb-1.5 mb-2">Connected Sources</p>
                {activeBucket.connectedSources.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-neutral-300 font-mono">
                    {activeBucket.connectedSources.map((source, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-brand-orange" />
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-500">No active connection sources linked.</p>
                )}
              </div>

              {/* Active Capabilities */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange border-b border-neutral-850 pb-1.5 mb-2">Active Capabilities</p>
                {activeBucket.activeCapabilities.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {activeBucket.activeCapabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-500">No capabilities enabled.</p>
                )}
              </div>

              {/* Active Cadence Jobs */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange border-b border-neutral-850 pb-1.5 mb-2">Cadence Cron Jobs</p>
                {activeBucket.cadenceJobs.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {activeBucket.cadenceJobs.map((job, idx) => (
                      <li key={idx} className="flex items-center gap-2 font-mono">
                        <span className="size-1.5 rounded-full bg-sky-400" />
                        <span>{job}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-500">No scheduled cron triggers mapped.</p>
                )}
              </div>

            </div>

            {/* Bucket Actions and Audit logs */}
            <div className="border-t border-neutral-800 pt-4 flex flex-wrap gap-2 justify-between items-center text-xs">
              <span className="text-neutral-500 font-mono">Status: verified offline ledger</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="text-white" onClick={() => alert("Creating task for bucket: " + activeBucket.name)}>
                  Create Cadence Trigger
                </Button>
                <Button variant="primary" size="sm" className="text-black font-semibold" onClick={() => alert("Adding connector schema to " + activeBucket.name)}>
                  Add Connector Schema
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom: Bucket-to-Connector Map */}
      <Card>
        <CardHeader>
          <CardTitle>Bucket-to-Connector Coverage Registry</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-neutral-900/50 text-xs uppercase text-neutral-450 font-semibold">
                <tr>
                  <th className="border-b border-neutral-800 px-4 py-2.5 text-left">Operating Bucket</th>
                  <th className="border-b border-neutral-800 px-4 py-2.5 text-left">Connector Name</th>
                  <th className="border-b border-neutral-800 px-4 py-2.5 text-left">Type</th>
                  <th className="border-b border-neutral-800 px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/40 text-xs">
                {Object.entries(CONNECTORS_DATA).flatMap(([bucketName, connectors]) =>
                  connectors.map((conn, idx) => (
                    <tr key={`${bucketName}-${conn.name}`} className="hover:bg-neutral-900/10">
                      {idx === 0 ? (
                        <td
                          rowSpan={connectors.length}
                          className="border-b border-neutral-800 px-4 py-3 font-bold text-white align-top border-r border-neutral-850/60 max-w-[140px]"
                        >
                          {bucketName}
                        </td>
                      ) : null}
                      <td className="border-b border-neutral-800/60 px-4 py-3 font-semibold text-neutral-350">{conn.name}</td>
                      <td className="border-b border-neutral-800/60 px-4 py-3 text-neutral-450 font-mono">{conn.type}</td>
                      <td className="border-b border-neutral-800/60 px-4 py-3 text-right">
                        <Badge
                          variant={
                            conn.status === "Active"
                              ? "success"
                              : conn.status === "Staged"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {conn.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
