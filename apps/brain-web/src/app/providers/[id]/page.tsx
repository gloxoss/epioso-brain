"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Button } from "../../../components/ui";

interface ProviderModel {
  readonly name: string;
  readonly speed: string;
  readonly context: string;
  readonly cost: string;
  readonly status: string;
}

interface ProviderSession {
  readonly id: string;
  readonly objective: string;
  readonly status: string;
  readonly date: string;
}

interface ProviderTaskType {
  readonly name: string;
  readonly rating: string;
}

interface ProviderAlternative {
  readonly name: string;
  readonly savings: string;
  readonly note: string;
}

interface ProviderStats {
  readonly sessions: number;
  readonly hoursSaved: number;
  readonly costSaved: string;
  readonly costPerSavedHour: string;
}

interface ProviderDetails {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly accessMode: string;
  readonly status: string;
  readonly monthlyCost: number;
  readonly stats: ProviderStats;
  readonly models: readonly ProviderModel[];
  readonly sessions: readonly ProviderSession[];
  readonly taskTypes: readonly ProviderTaskType[];
  readonly alternatives: readonly ProviderAlternative[];
}

const PROVIDERS_DETAIL_MAP: Record<string, ProviderDetails> = {
  "claude": {
    id: "claude",
    name: "Anthropic Claude",
    type: "API Provider",
    accessMode: "Direct API Access / Console Subscription",
    status: "Active",
    monthlyCost: 20,
    stats: { sessions: 42, hoursSaved: 85, costSaved: "$340.00", costPerSavedHour: "$0.24" },
    models: [
      { name: "Claude 3.5 Sonnet", speed: "Fast", context: "200k", cost: "Premium ($15.00 / M tokens)", status: "Active" },
      { name: "Claude 3.5 Haiku", speed: "Ultra-fast", context: "200k", cost: "Moderate ($4.00 / M tokens)", status: "Active" },
      { name: "Claude 3 Opus", speed: "Moderate", context: "200k", cost: "High ($75.00 / M tokens)", status: "Inactive" },
    ],
    sessions: [
      { id: "sess-02", objective: "Implement HIPAA schema validation rules", status: "Completed", date: "2026-06-02" },
      { id: "sess-05", objective: "Scaffold responsive CSS grids", status: "Completed", date: "2026-05-30" },
    ],
    taskTypes: [
      { name: "Complex Logic & Reasoning", rating: "Excellent" },
      { name: "Codebase Refactoring", rating: "Excellent" },
      { name: "Exploratory Data Analysis", rating: "Good" },
    ],
    alternatives: [
      { name: "Gemini 1.5 Pro", savings: "$5.00 / M tokens", note: "Slightly slower reasoning, larger 2M context." },
    ],
  },
  "gemini": {
    id: "gemini",
    name: "Google Gemini",
    type: "API Provider",
    accessMode: "Direct API Access / Google AI Studio Key",
    status: "Active",
    monthlyCost: 0,
    stats: { sessions: 18, hoursSaved: 42, costSaved: "$168.00", costPerSavedHour: "$0.00" },
    models: [
      { name: "Gemini 1.5 Flash", speed: "Ultra-fast", context: "1.0M", cost: "Low ($0.075 / M tokens)", status: "Active" },
      { name: "Gemini 1.5 Pro", speed: "Fast", context: "2.0M", cost: "Moderate ($3.50 / M tokens)", status: "Active" },
    ],
    sessions: [
      { id: "sess-01", objective: "Implement dynamic dashboard routes", status: "Completed", date: "2026-06-02" },
    ],
    taskTypes: [
      { name: "Static Linting & Syntax Scans", rating: "Excellent" },
      { name: "Context Retrieval (Large Files)", rating: "Excellent" },
      { name: "SMS Script Drafting", rating: "Good" },
    ],
    alternatives: [
      { name: "Claude 3.5 Haiku", savings: "None", note: "Claude Haiku is more expensive ($4.00 vs $0.075)." },
    ],
  },
  "codex": {
    id: "codex",
    name: "OpenAI Codex / GPT",
    type: "API Provider",
    accessMode: "Direct API Access / Platform Account",
    status: "Active",
    monthlyCost: 35,
    stats: { sessions: 65, hoursSaved: 110, costSaved: "$440.00", costPerSavedHour: "$0.32" },
    models: [
      { name: "GPT-4o", speed: "Fast", context: "128k", cost: "Premium ($10.00 / M tokens)", status: "Active" },
      { name: "GPT-4o-mini", speed: "Ultra-fast", context: "128k", cost: "Low ($0.15 / M tokens)", status: "Active" },
      { name: "o1-preview", speed: "Slow (Reasoning)", context: "128k", cost: "Ultra-premium ($60.00 / M tokens)", status: "Inactive" },
    ],
    sessions: [
      { id: "sess-04", objective: "Verify patient de-identification pipelines", status: "Blocked", date: "2026-06-01" },
    ],
    taskTypes: [
      { name: "Standard Coding & Boilerplates", rating: "Excellent" },
      { name: "Search-Augmented Generation", rating: "Excellent" },
      { name: "Fuzzy Logic Checks", rating: "Good" },
    ],
    alternatives: [
      { name: "Gemini 1.5 Flash", savings: "Save up to 90% cost", note: "Flash is extremely cheap for coding lints." },
    ],
  },
  "openrouter": {
    id: "openrouter",
    name: "OpenRouter Proxy",
    type: "Proxy API",
    accessMode: "Unified API Key / Proxy Billing",
    status: "Inactive",
    monthlyCost: 0,
    stats: { sessions: 0, hoursSaved: 0, costSaved: "$0.00", costPerSavedHour: "$0.00" },
    models: [
      { name: "DeepSeek Coder (33B)", speed: "Fast", context: "64k", cost: "Low ($1.00 / M tokens)", status: "Active" },
      { name: "Llama 3.1 (405B)", speed: "Slow", context: "128k", cost: "Premium ($15.00 / M tokens)", status: "Active" },
    ],
    sessions: [],
    taskTypes: [
      { name: "Open-source Model Prototyping", rating: "Excellent" },
      { name: "Dialect Variation Generation", rating: "Good" },
    ],
    alternatives: [
      { name: "Direct Anthropic API", savings: "Varies", note: "Direct Anthropic API bypasses proxy latency." },
    ],
  },
  "ollama": {
    id: "ollama",
    name: "Local Ollama",
    type: "Local (Hardware)",
    accessMode: "Local Workstation GPU Server",
    status: "Active",
    monthlyCost: 0,
    stats: { sessions: 12, hoursSaved: 12, costSaved: "$48.00", costPerSavedHour: "$0.00" },
    models: [
      { name: "Llama 3.1 (8B)", speed: "Moderate (Local GPU)", context: "32k", cost: "Free ($0.00)", status: "Active" },
      { name: "Mistral (7B)", speed: "Moderate (Local GPU)", context: "32k", cost: "Free ($0.00)", status: "Active" },
      { name: "Qwen 2.5 Coder (7B)", speed: "Moderate", context: "32k", cost: "Free ($0.00)", status: "Active" },
    ],
    sessions: [],
    taskTypes: [
      { name: "Privacy-compliant Sandboxing", rating: "Excellent" },
      { name: "Zero-shot Text Sanitization", rating: "Excellent" },
      { name: "Offline Development Scaffolds", rating: "Good" },
    ],
    alternatives: [
      { name: "Direct API Providers", savings: "None (local is free)", note: "Local models protect private client phone logs completely." },
    ],
  },
};

export default function ProviderDetailPage() {
  const { id } = useParams();
  const providerId = typeof id === "string" ? id : "";
  const [provider, setProvider] = useState<ProviderDetails | undefined>(PROVIDERS_DETAIL_MAP[providerId]);

  if (!provider) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-white">Provider Not Found</h1>
        <p className="text-sm text-neutral-400">The provider ID &ldquo;{providerId}&rdquo; was not found in the tools registry.</p>
        <Link href="/tools" className="inline-flex h-9 items-center rounded-md bg-brand-orange px-4 text-xs font-semibold text-black transition-colors hover:bg-brand-orange-hover">
          Back to Tools
        </Link>
      </div>
    );
  }

  const statusColorMap: Record<string, "neutral" | "info" | "success" | "warning" | "danger" | "private"> = {
    "Active": "success" as const,
    "Inactive": "neutral" as const,
    "Completed": "success" as const,
  };

  function handleToggleActive() {
    if (!provider) return;
    const nextStatus = provider.status === "Active" ? "Inactive" : "Active";
    setProvider({
      ...provider,
      status: nextStatus,
    });
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Link
          href="/tools"
          className="inline-flex h-8 items-center rounded border border-neutral-800 bg-brand-black-soft px-3 text-xs font-semibold text-neutral-300 hover:bg-brand-graphite transition-colors"
        >
          &larr; Back to Tools & Models
        </Link>
        <Badge variant="private">Provider Registry Detail</Badge>
      </div>

      {/* Provider Details Block */}
      <div className="rounded-lg border border-neutral-800 bg-brand-black-soft p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusColorMap[provider.status] || "neutral"}>{provider.status}</Badge>
              <span className="text-xs text-neutral-500 font-mono">{provider.type}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{provider.name}</h1>
            <p className="text-sm text-neutral-400 font-mono">{provider.accessMode}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={provider.status === "Active" ? "secondary" : "primary"} onClick={handleToggleActive} className={provider.status !== "Active" ? "text-black" : "text-white"}>
              {provider.status === "Active" ? "Disable Provider" : "Enable Provider"}
            </Button>
            <Button variant="secondary" className="border-neutral-800 text-white" onClick={() => alert("Add usage estimate logged...")}>
              Add Usage Estimate
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Monthly Sub Cost</p>
            <p className="text-2xl font-bold text-brand-orange">${provider.monthlyCost} / mo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Sessions Conducted</p>
            <p className="text-2xl font-bold text-white">{provider.stats.sessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Est. Hours Saved</p>
            <p className="text-2xl font-bold text-white">{provider.stats.hoursSaved} hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Cost / Saved Hour</p>
            <p className="text-2xl font-bold text-brand-orange">{provider.stats.costPerSavedHour}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Models list & Right recommendation panels */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        
        {/* Left Area: Models table & Recent sessions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported Models Matrix</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-sm">
                  <thead className="bg-neutral-900/40 text-xs uppercase text-neutral-400 font-semibold">
                    <tr>
                      <th className="border-b border-neutral-800 px-4 py-2.5 text-left">Model name</th>
                      <th className="border-b border-neutral-800 px-4 py-2.5 text-left">Speed</th>
                      <th className="border-b border-neutral-800 px-4 py-2.5 text-left">Context Window</th>
                      <th className="border-b border-neutral-800 px-4 py-2.5 text-left">Cost Estimate</th>
                      <th className="border-b border-neutral-800 px-4 py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/40">
                    {provider.models.map((model) => (
                      <tr key={model.name} className="hover:bg-neutral-900/10">
                        <td className="border-b border-neutral-850 px-4 py-3 font-semibold text-white">{model.name}</td>
                        <td className="border-b border-neutral-850 px-4 py-3 text-neutral-300">{model.speed}</td>
                        <td className="border-b border-neutral-850 px-4 py-3 font-mono text-xs text-neutral-300">{model.context}</td>
                        <td className="border-b border-neutral-850 px-4 py-3 text-neutral-400 font-mono text-xs">{model.cost}</td>
                        <td className="border-b border-neutral-850 px-4 py-3 text-right">
                          <Badge variant={model.status === "Active" ? "success" : "neutral"}>{model.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent sessions using this provider */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions Using {provider.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {provider.sessions.length > 0 ? (
                <div className="space-y-4">
                  {provider.sessions.map((sess) => (
                    <div key={sess.id} className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link href={`/sessions/${sess.id}`} className="text-sm font-bold text-white hover:text-brand-orange transition-colors">
                          {sess.objective}
                        </Link>
                        <p className="text-xs text-neutral-500 font-mono mt-1">ID: {sess.id} &bull; Date: {sess.date}</p>
                      </div>
                      <Badge variant={statusColorMap[sess.status] || "success"}>{sess.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 py-2">No session ledger records registered for this provider family.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Best Task fit & Cheaper alternatives */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Usage Targets</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4 text-sm">
                {provider.taskTypes.map((task) => (
                  <div key={task.name} className="flex items-center justify-between border-b border-neutral-800/40 pb-2.5">
                    <span className="text-neutral-300 font-semibold text-xs">{task.name}</span>
                    <Badge variant="success">{task.rating}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cheaper Alternatives Panel */}
          {provider.alternatives.map((alt) => (
            <Card key={alt.name} className="bg-brand-paper border-brand-light-grey text-neutral-900">
              <CardHeader className="border-neutral-200">
                <CardTitle className="text-neutral-950 font-bold uppercase tracking-wider text-xs">Alternative efficiency tip</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800">Cheaper Option:</span>
                  <span className="text-brand-orange font-bold font-mono">{alt.savings}</span>
                </div>
                <p className="leading-5 text-neutral-700 font-semibold">{alt.name}</p>
                <div className="rounded bg-brand-paper-soft p-2.5 border border-neutral-300 text-neutral-600">
                  {alt.note}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
