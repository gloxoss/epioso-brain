"use client";

import { useState } from "react";
import { Badge, Card, CardContent, PageHeader } from "../../components/ui";

interface CostItem {
  readonly id: string;
  readonly name: string;
  readonly category: "Subscription" | "API" | "Infrastructure";
  readonly provider: string;
  readonly amount: number;
  readonly cycle: "Monthly" | "Pay-as-you-go" | "Annual";
  readonly status: "Active" | "Inactive" | "Near Limit";
  readonly description: string;
}

const COSTS_DATA: readonly CostItem[] = [
  {
    id: "openai-api",
    name: "OpenAI API",
    category: "API",
    provider: "OpenAI",
    amount: 45.2,
    cycle: "Pay-as-you-go",
    status: "Active",
    description: "API tokens utilized for GPT-4o-mini and text embeddings.",
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    category: "API",
    provider: "Anthropic",
    amount: 112.8,
    cycle: "Pay-as-you-go",
    status: "Active",
    description: "Claude 3.5 Sonnet token usage in coding agents (Claude Code, workspace scripts).",
  },
  {
    id: "claude-pro",
    name: "Claude Pro Subscription",
    category: "Subscription",
    provider: "Anthropic",
    amount: 20.0,
    cycle: "Monthly",
    status: "Active",
    description: "Claude Chat interface subscription.",
  },
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    category: "Subscription",
    provider: "OpenAI",
    amount: 20.0,
    cycle: "Monthly",
    status: "Active",
    description: "ChatGPT dashboard access.",
  },
  {
    id: "supabase-db",
    name: "Supabase Pro",
    category: "Infrastructure",
    provider: "Supabase",
    amount: 25.0,
    cycle: "Monthly",
    status: "Active",
    description: "Database hosting and vector storage for memory context.",
  },
  {
    id: "vercel-hosting",
    name: "Vercel Pro Workspace",
    category: "Infrastructure",
    provider: "Vercel",
    amount: 20.0,
    cycle: "Monthly",
    status: "Inactive",
    description: "Staging and deployment pipeline hosting (Currently paused, using local-only dev servers).",
  },
  {
    id: "n8n-cloud",
    name: "n8n Cloud Automation",
    category: "Infrastructure",
    provider: "n8n",
    amount: 20.0,
    cycle: "Monthly",
    status: "Active",
    description: "Runs deterministic workflow triggers and integrations.",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "Subscription",
    provider: "GitHub",
    amount: 10.0,
    cycle: "Monthly",
    status: "Active",
    description: "In-editor inline autocomplete tool.",
  },
];

export default function CostsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCosts = COSTS_DATA.filter((cost) => {
    const matchesCategory = categoryFilter === "All" || cost.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || cost.status === statusFilter;
    const matchesSearch =
      cost.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cost.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalMonthlySpend = COSTS_DATA.reduce((acc, item) => {
    if (item.status === "Inactive") return acc;
    return acc + item.amount;
  }, 0);

  const apiSpend = COSTS_DATA.filter((item) => item.category === "API" && item.status === "Active").reduce(
    (acc, item) => acc + item.amount,
    0
  );

  const subscriptionSpend = COSTS_DATA.filter(
    (item) => item.category === "Subscription" && item.status === "Active"
  ).reduce((acc, item) => acc + item.amount, 0);

  const infraSpend = COSTS_DATA.filter(
    (item) => item.category === "Infrastructure" && item.status === "Active"
  ).reduce((acc, item) => acc + item.amount, 0);

  const statusColorMap = {
    Active: "success" as const,
    Inactive: "neutral" as const,
    "Near Limit": "warning" as const,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Costs & Subscription Registry"
        description="Track all monthly AI bills, token API expenditures, and developer tools in a unified registry."
        actions={
          <Badge variant="neutral">Estimated Limit: $300.00 / mo</Badge>
        }
      />

      {/* Summary dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-brand-soft-black border-brand-graphite text-white">
          <CardContent className="pt-6 space-y-2">
            <p className="text-xs font-semibold text-brand-muted-grey uppercase tracking-widest">
              Total Active Spend
            </p>
            <div className="text-3xl font-extrabold text-white">
              ${totalMonthlySpend.toFixed(2)}
              <span className="text-xs font-normal text-brand-muted-grey"> / mo</span>
            </div>
            <div className="h-1.5 w-full bg-brand-graphite rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-brand-orange"
                style={{ width: `${(totalMonthlySpend / 300) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-brand-muted-grey mt-1">
              84% remains under monthly budget ceiling.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Token APIs (Pay-as-you-go)
            </p>
            <div className="text-2xl font-bold text-neutral-900">${apiSpend.toFixed(2)}</div>
            <p className="text-xs text-neutral-500">Fluctuates with coding agent loop counts.</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Fixed Subscriptions
            </p>
            <div className="text-2xl font-bold text-neutral-900">${subscriptionSpend.toFixed(2)}</div>
            <p className="text-xs text-neutral-500">ChatGPT Plus, Claude Pro, and Copilot licenses.</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-warm-paper border-brand-muted-grey/20 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-brand-muted-grey uppercase tracking-wider">
              Infrastructure & Automation
            </p>
            <div className="text-2xl font-bold text-neutral-950">${infraSpend.toFixed(2)}</div>
            <p className="text-xs text-brand-muted-grey">Supabase database hosting and n8n pipelines.</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search panel */}
      <div className="grid gap-3 p-4 rounded-lg border border-neutral-200 bg-white md:grid-cols-4 items-center">
        <div>
          <label htmlFor="search" className="block text-xs font-bold text-neutral-500 uppercase mb-1">Search Service</label>
          <input
            id="search"
            type="text"
            placeholder="e.g. Claude, Vercel"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 px-3 rounded border border-neutral-300 text-sm focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Category</label>
          <div className="flex gap-1">
            {["All", "API", "Subscription", "Infrastructure"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`h-8 px-2.5 rounded text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  categoryFilter === cat
                    ? "bg-brand-orange border-brand-orange text-white"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {cat === "Infrastructure" ? "Infra" : cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Billing Status</label>
          <div className="flex gap-1">
            {["All", "Active", "Inactive"].map((stat) => (
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
            Register spend
          </button>
        </div>
      </div>

      {/* Cost registry Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3 bg-neutral-50/50">
          <p className="text-sm font-semibold text-neutral-950">Active Costs</p>
          <p className="mt-1 text-sm text-neutral-600">
            A comprehensive list of services, token API nodes, and infrastructure assets.
          </p>
        </div>

        {filteredCosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 font-semibold">
                <tr>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Service</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Category</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Provider</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Monthly Cost</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Billing Mode</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCosts.map((cost) => (
                  <tr key={cost.id} className="hover:bg-neutral-50/40">
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <div>
                        <p className="font-semibold text-neutral-950">{cost.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{cost.description}</p>
                      </div>
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <span className="inline-block rounded bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                        {cost.category}
                      </span>
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 text-neutral-600">
                      {cost.provider}
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 font-semibold text-neutral-950">
                      ${cost.amount.toFixed(2)}
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 text-neutral-500 text-xs">
                      {cost.cycle}
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <Badge variant={statusColorMap[cost.status]}>{cost.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 text-sm">
            No cost entries match the current filter parameters.
          </div>
        )}
      </div>
    </div>
  );
}
