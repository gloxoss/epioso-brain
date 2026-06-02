"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Card, CardContent, Button, PageHeader } from "../../components/ui";

interface Provider {
  readonly id: string;
  readonly name: string;
  readonly active: boolean;
  readonly cost: number;
  readonly type: string;
  readonly limit: string;
  readonly hoursSaved: number;
  readonly modelsCount: number;
}

interface ModelItem {
  readonly name: string;
  readonly provider: string;
  readonly taskFit: string;
  readonly costTier: string;
  readonly speed: string;
  readonly context: string;
  readonly status: "Active" | "Inactive";
}

const PROVIDERS_DATA: readonly Provider[] = [
  { id: "claude", name: "Anthropic Claude", active: true, cost: 20, type: "API & Subscription", limit: "40k tokens/min", hoursSaved: 85, modelsCount: 3 },
  { id: "gemini", name: "Google Gemini", active: true, cost: 0, type: "API (Free tier)", limit: "15 requests/min", hoursSaved: 42, modelsCount: 2 },
  { id: "codex", name: "OpenAI Codex / GPT", active: true, cost: 35, type: "API usage", limit: "100k tokens/min", hoursSaved: 110, modelsCount: 3 },
  { id: "openrouter", name: "OpenRouter Proxy", active: false, cost: 0, type: "Proxy API", limit: "Varies by model", hoursSaved: 0, modelsCount: 12 },
  { id: "ollama", name: "Local Ollama", active: true, cost: 0, type: "Local (Hardware)", limit: "Unlimited (GPU)", hoursSaved: 12, modelsCount: 4 },
];

const MODELS_DATA: readonly ModelItem[] = [
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", taskFit: "Complex Logic / Reasoning", costTier: "Premium ($15.00/M tokens)", speed: "Fast", context: "200k", status: "Active" },
  { name: "Gemini 1.5 Flash", provider: "Google", taskFit: "Static Linting / Quick Edits", costTier: "Low ($0.075/M tokens)", speed: "Ultra-fast", context: "1.0M", status: "Active" },
  { name: "GPT-4o", provider: "OpenAI", taskFit: "General Coding / Search", costTier: "Premium ($10.00/M tokens)", speed: "Fast", context: "128k", status: "Active" },
  { name: "Llama 3.1 (8B)", provider: "Local (Ollama)", taskFit: "Privacy-compliant De-ID", costTier: "Free ($0.00)", speed: "Moderate (Local GPU)", context: "32k", status: "Active" },
  { name: "DeepSeek Coder (33B)", provider: "OpenRouter", taskFit: "Fuzzy Code completion", costTier: "Low ($1.00/M tokens)", speed: "Fast", context: "64k", status: "Inactive" },
];

const OPPORTUNITIES_DATA = [
  { id: "opp-1", title: "Optimize Static Lints", description: "Route n8n validation jobs to Gemini Flash instead of GPT-4o. Monthly savings estimated at $34.50." },
  { id: "opp-2", title: "Localize De-Identification", description: "Offload de-id model checking entirely to local Llama 3.1 (Ollama). Cuts cloud token spend to zero." },
  { id: "opp-3", title: "Reserve Reasoning Models", description: "Use Anthropic Claude 3.5 Sonnet only for final reviews and large structural modifications." },
];

export default function ToolsRegistryPage() {
  const [providers, setProviders] = useState<readonly Provider[]>(PROVIDERS_DATA);
  const [filterProvider, setFilterProvider] = useState<string>("All");

  function handleToggleProvider(id: string) {
    setProviders(providers.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  const activeProviders = providers.filter(p => p.active);
  const totalCost = activeProviders.reduce((sum, p) => sum + p.cost, 0);

  const filteredModels = MODELS_DATA.filter(
    m => filterProvider === "All" || m.provider.toLowerCase().includes(filterProvider.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="AI Stack Registry"
        title="Tools & Models"
        description="Track active AI tools, providers, cost allocations, token thresholds, and optimized models routing."
        actions={
          <Button variant="primary" className="text-black font-semibold" onClick={() => alert("Add Provider integration modal...")}>
            Add Provider
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Active Providers</p>
            <p className="text-2xl font-bold text-white">{activeProviders.length} / {providers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Monthly Subscriptions</p>
            <p className="text-2xl font-bold text-brand-orange">${totalCost} / mo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Local Models Running</p>
            <p className="text-2xl font-bold text-white">
              {providers.find(p => p.id === "ollama")?.active ? "4 Models" : "Disabled"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Limits Health</p>
            <p className="text-sm font-semibold text-emerald-400">All Quotas Ok</p>
          </CardContent>
        </Card>
      </div>

      {/* Title Label section */}
      <div className="border-b border-neutral-800 pb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">AI Stack / Providers Ledger</p>
      </div>

      {/* Providers Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((prov) => (
          <Card key={prov.id} className={prov.active ? "border-brand-orange/20" : "border-neutral-800"}>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/providers/${prov.id}`} className="text-base font-bold text-white hover:text-brand-orange transition-colors">
                    {prov.name}
                  </Link>
                  <p className="text-xs text-neutral-500 mt-0.5">{prov.type}</p>
                </div>
                <Badge variant={prov.active ? "success" : "neutral"}>
                  {prov.active ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-neutral-800/60 pt-3">
                <div>
                  <span className="text-neutral-500">Limit: </span>
                  <span className="text-neutral-300">{prov.limit}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Monthly Cost: </span>
                  <span className="text-brand-orange font-bold">${prov.cost}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Models: </span>
                  <span className="text-neutral-300">{prov.modelsCount} available</span>
                </div>
                <div>
                  <span className="text-neutral-500">Hours Saved: </span>
                  <span className="text-neutral-300 font-bold">{prov.hoursSaved} hrs</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-neutral-800/40 pt-3 justify-between">
                <Button variant="secondary" size="sm" onClick={() => handleToggleProvider(prov.id)} className="text-white border-neutral-800">
                  {prov.active ? "Disable" : "Enable"}
                </Button>
                <Link href={`/providers/${prov.id}`} className="inline-flex h-8 items-center rounded-md border border-neutral-800 px-3 text-xs font-medium text-neutral-400 hover:text-white transition-colors">
                  Configure &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Comparison Section & Cheaper Alternatives Panel */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        
        {/* Model Comparison Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Model Capability Matrix</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Filter:</span>
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="bg-brand-black-soft border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-brand-orange"
              >
                <option value="All">All Providers</option>
                <option value="Anthropic">Anthropic</option>
                <option value="Google">Google</option>
                <option value="OpenAI">OpenAI</option>
                <option value="Local">Local (Ollama)</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-neutral-800 bg-brand-black-soft">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="bg-neutral-900/50 text-xs uppercase text-neutral-400 font-semibold">
                  <tr>
                    <th className="border-b border-neutral-800 px-4 py-3 text-left">Model Name</th>
                    <th className="border-b border-neutral-800 px-4 py-3 text-left">Provider</th>
                    <th className="border-b border-neutral-800 px-4 py-3 text-left">Fit Target</th>
                    <th className="border-b border-neutral-800 px-4 py-3 text-left">Context</th>
                    <th className="border-b border-neutral-800 px-4 py-3 text-left">Speed</th>
                    <th className="border-b border-neutral-800 px-4 py-3 text-left">Cost Tier</th>
                    <th className="border-b border-neutral-800 px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  {filteredModels.map((model) => (
                    <tr key={model.name} className="hover:bg-neutral-900/10">
                      <td className="border-b border-neutral-850 px-4 py-3 font-semibold text-white">{model.name}</td>
                      <td className="border-b border-neutral-850 px-4 py-3 text-neutral-400">{model.provider}</td>
                      <td className="border-b border-neutral-850 px-4 py-3 text-brand-orange text-xs font-semibold">{model.taskFit}</td>
                      <td className="border-b border-neutral-850 px-4 py-3 font-mono text-xs text-neutral-300">{model.context}</td>
                      <td className="border-b border-neutral-850 px-4 py-3 text-neutral-300">{model.speed}</td>
                      <td className="border-b border-neutral-850 px-4 py-3 text-xs text-neutral-400 font-mono">{model.costTier}</td>
                      <td className="border-b border-neutral-850 px-4 py-3 text-right">
                        <Badge variant={model.status === "Active" ? "success" : "neutral"}>{model.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel: Cheaper Model Opportunities */}
        <div className="space-y-4">
          <div className="border-b border-neutral-800 pb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Optimization Tips</p>
          </div>

          <div className="space-y-4">
            {OPPORTUNITIES_DATA.map((opp) => (
              <Card key={opp.id} className="bg-brand-paper border-brand-light-grey text-neutral-900">
                <CardContent className="pt-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded bg-brand-orange/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange">
                      Token cost efficiency
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Finding</span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-950">{opp.title}</h4>
                  <p className="text-xs leading-normal text-neutral-700">{opp.description}</p>
                  <div className="pt-2 flex justify-end">
                    <Button variant="secondary" size="sm" className="bg-neutral-200 border-neutral-300 hover:bg-neutral-300 text-neutral-800 font-bold" onClick={() => alert("Opportunity '" + opp.title + "' accepted and staged for configuration!")}>
                      Apply Routine
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
