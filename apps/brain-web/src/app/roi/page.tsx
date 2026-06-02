"use client";

import { useState } from "react";
import { Badge, Card, CardContent, PageHeader } from "../../components/ui";

interface WorkflowROI {
  readonly id: string;
  readonly name: string;
  readonly project: string;
  readonly hoursSavedPerMonth: number;
  readonly runFrequency: string; // e.g. "Daily", "Weekly"
  readonly aiCostPerRun: number;
  readonly status: "Concept / Proof" | "Delivered / Production";
  readonly description: string;
}

const HOURLY_RATE = 100; // $100/hr Oussama's time

const WORKFLOWS_ROI_DATA: readonly WorkflowROI[] = [
  {
    id: "resume-matching",
    name: "Resume-Job Matching Agent",
    project: "Master's AI Portfolio (Prompt 28)",
    hoursSavedPerMonth: 12.0,
    runFrequency: "Daily",
    aiCostPerRun: 0.15,
    status: "Delivered / Production",
    description: "Autonomously parses PDF CVs and ranks them against job postings using Sentence-BERT embeddings.",
  },
  {
    id: "form-filling",
    name: "Application Form-Filling Automator",
    project: "Master's AI Portfolio (Prompt 24)",
    hoursSavedPerMonth: 16.5,
    runFrequency: "Daily",
    aiCostPerRun: 0.22,
    status: "Delivered / Production",
    description: "Playwright browser script combined with instruction-tuned LLM mapping to pre-fill application templates.",
  },
  {
    id: "medical-deid",
    name: "Medical Note De-identification API",
    project: "Healthcare Track (Prompt 16, 20)",
    hoursSavedPerMonth: 8.0,
    runFrequency: "Weekly (Staged)",
    aiCostPerRun: 0.08,
    status: "Concept / Proof",
    description: "BERT-based token classification and DeId-Small model runs to sanitize patient-identifiable parameters from notes.",
  },
  {
    id: "medical-rag",
    name: "PubMed RAG Chat Copilot",
    project: "Healthcare Track (Prompt 10, 17)",
    hoursSavedPerMonth: 10.0,
    runFrequency: "Weekly (Staged)",
    aiCostPerRun: 0.35,
    status: "Concept / Proof",
    description: "Hybrid vector + keyword search grounding chatbot answers in 5.8M medical QA tuples.",
  },
  {
    id: "content-generator",
    name: "Instagram Post Generator & n8n Trigger",
    project: "Epioso Brand Engine",
    hoursSavedPerMonth: 6.0,
    runFrequency: "Weekly",
    aiCostPerRun: 0.40,
    status: "Delivered / Production",
    description: "Orchestrates square design overlays and schedules brand-aligned drafts on warm paper layouts.",
  },
];

export default function ROIPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredWorkflows = WORKFLOWS_ROI_DATA.filter((wf) => {
    const matchesStatus = statusFilter === "All" || wf.status === statusFilter;
    const matchesSearch =
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate gross monthly hours saved
  const activeHoursSaved = WORKFLOWS_ROI_DATA.reduce((acc, wf) => {
    return acc + wf.hoursSavedPerMonth;
  }, 0);

  // Gross savings value
  const grossSavingsValue = activeHoursSaved * HOURLY_RATE;

  // Monthly active AI costs: rough estimate based on runs
  const activeAICost = WORKFLOWS_ROI_DATA.reduce((acc, wf) => {
    const multiplier = wf.runFrequency.startsWith("Daily") ? 30 : 4.3;
    return acc + (wf.aiCostPerRun * multiplier);
  }, 0);

  const netROIValue = grossSavingsValue - activeAICost;
  const roiMultiplier = activeAICost > 0 ? (grossSavingsValue / activeAICost).toFixed(1) : "0";

  const statusColorMap = {
    "Concept / Proof": "warning" as const,
    "Delivered / Production": "success" as const,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Value"
        title="ROI & Efficiency Tracker"
        description="Verify developer time saved, API execution costs, and operational leverage indicators across all tasks."
        actions={
          <Badge variant="private">Hourly Rate: ${HOURLY_RATE}.00 / hr</Badge>
        }
      />

      {/* ROI Metrics Widgets */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-brand-soft-black border-brand-graphite text-white">
          <CardContent className="pt-6 space-y-2">
            <p className="text-xs font-semibold text-brand-muted-grey uppercase tracking-widest">
              Net Monthly ROI
            </p>
            <div className="text-3xl font-extrabold text-white">
              +${netROIValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-brand-muted-grey">
              Gross Value Generated - Token Run Cost
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Time Reclaimed
            </p>
            <div className="text-3xl font-bold text-neutral-900">{activeHoursSaved} Hours</div>
            <p className="text-xs text-neutral-500">Accumulated designer & developer hours saved.</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-warm-paper border-brand-muted-grey/20 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-brand-muted-grey uppercase tracking-wider">
              Leverage Multiplier
            </p>
            <div className="text-3xl font-extrabold text-brand-orange">{roiMultiplier}x</div>
            <p className="text-xs text-brand-muted-grey">Value return relative to API token investment.</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Monthly Running Cost
            </p>
            <div className="text-2xl font-bold text-neutral-900">${activeAICost.toFixed(2)}</div>
            <p className="text-xs text-neutral-500">Pay-as-you-go workflow API costs.</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search panel */}
      <div className="grid gap-3 p-4 rounded-lg border border-neutral-200 bg-white md:grid-cols-3 items-center">
        <div>
          <label htmlFor="wf-search" className="block text-xs font-bold text-neutral-500 uppercase mb-1">Search Workflows</label>
          <input
            id="wf-search"
            type="text"
            placeholder="e.g. Resume, Note, Instagram"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 px-3 rounded border border-neutral-300 text-sm focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Maturity Status</label>
          <div className="flex gap-1">
            {["All", "Delivered / Production", "Concept / Proof"].map((stat) => (
              <button
                key={stat}
                onClick={() => setStatusFilter(stat)}
                className={`h-8 px-3 rounded text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  statusFilter === stat
                    ? "bg-brand-orange border-brand-orange text-white"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {stat.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-5 md:pt-0">
          <div className="text-xs text-neutral-500 text-right">
            <p className="font-semibold text-neutral-700">Audit Rule:</p>
            <p>Non-production/academic tracks are designated as Concept Proofs.</p>
          </div>
        </div>
      </div>

      {/* ROI Registry Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3 bg-neutral-50/50">
          <p className="text-sm font-semibold text-neutral-950">Workflow Value Registry</p>
          <p className="mt-1 text-sm text-neutral-600">
            Automations tracked by AgentOS to gauge engineering productivity and savings value.
          </p>
        </div>

        {filteredWorkflows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 font-semibold">
                <tr>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Workflow</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Target Project</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Hours Saved / mo</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Monthly Saved Value</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Maturity</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right">Run Cost</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkflows.map((wf) => {
                  const grossVal = wf.hoursSavedPerMonth * HOURLY_RATE;
                  return (
                    <tr key={wf.id} className="hover:bg-neutral-50/40">
                      <td className="border-b border-neutral-100 px-4 py-3.5">
                        <div>
                          <p className="font-semibold text-neutral-950">{wf.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{wf.description}</p>
                        </div>
                      </td>
                      <td className="border-b border-neutral-100 px-4 py-3.5 text-neutral-600 text-xs font-mono">
                        {wf.project}
                      </td>
                      <td className="border-b border-neutral-100 px-4 py-3.5 font-medium text-neutral-700">
                        {wf.hoursSavedPerMonth} hours
                      </td>
                      <td className="border-b border-neutral-100 px-4 py-3.5 font-bold text-neutral-950">
                        ${grossVal.toFixed(2)}
                      </td>
                      <td className="border-b border-neutral-100 px-4 py-3.5">
                        <Badge variant={statusColorMap[wf.status]}>{wf.status}</Badge>
                      </td>
                      <td className="border-b border-neutral-100 px-4 py-3.5 text-right text-neutral-500 font-mono text-xs">
                        ${wf.aiCostPerRun.toFixed(2)} / run ({wf.runFrequency.split(" ")[0]})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 text-sm">
            No workflows match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
