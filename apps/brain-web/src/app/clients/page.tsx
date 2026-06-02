"use client";

import { useState } from "react";
import { Badge, Card, CardContent, PageHeader } from "../../components/ui";

interface ClientAccount {
  readonly id: string;
  readonly name: string;
  readonly value: number;
  readonly stage: "Lead" | "Proposal" | "Negotiation" | "Signed" | "Delivered" | "Lost";
  readonly status: "Active Client" | "Lead (Pipeline)" | "Archived";
  readonly automationScope: string;
  readonly progress: number; // Implementation progress or deal likelihood
  readonly lastContact: string;
  readonly details: string;
}

const CLIENTS_ACCOUNTS_DATA: readonly ClientAccount[] = [
  {
    id: "fes-tawsil",
    name: "Fes Tawsil Logistics",
    value: 8500,
    stage: "Signed",
    status: "Active Client",
    automationScope: "n8n Driver Dispatch & Routing System",
    progress: 75,
    lastContact: "2026-05-30",
    details: "Automated route allocation API complete; driver app syncing staged triggers.",
  },
  {
    id: "epioso-pet-care",
    name: "Epioso Pet Care Store",
    value: 6000,
    stage: "Proposal",
    status: "Lead (Pipeline)",
    automationScope: "E-Commerce Sentiment Reviews & Support Triage",
    progress: 90, // 90% chance or proposal progress
    lastContact: "2026-06-01",
    details: "Commercial proposal drafted on warm paper template, awaiting client signoff.",
  },
  {
    id: "casa-medical-clinic",
    name: "Casablanca Medical Clinic",
    value: 12000,
    stage: "Negotiation",
    status: "Lead (Pipeline)",
    automationScope: "Medical Note De-identification API (Concept)",
    progress: 40,
    lastContact: "2026-05-28",
    details: "Reviewing compliance frameworks for local BERT de-identification models.",
  },
  {
    id: "marrakech-riad",
    name: "Marrakech Boutique Riad",
    value: 4500,
    stage: "Lost",
    status: "Archived",
    automationScope: "Client Booking & Reception Chatbot",
    progress: 0,
    lastContact: "2026-04-15",
    details: "Lost to cheap generic SaaS competitor template. Stated ROI wasn't justified.",
  },
];

export default function ClientsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAccounts = CLIENTS_ACCOUNTS_DATA.filter((account) => {
    const matchesStatus = statusFilter === "All" || account.status === statusFilter;
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.automationScope.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeClients = CLIENTS_ACCOUNTS_DATA.filter((a) => a.status === "Active Client");
  const pipelineLeads = CLIENTS_ACCOUNTS_DATA.filter((a) => a.status === "Lead (Pipeline)");

  const totalPipelineValue = pipelineLeads.reduce((acc, lead) => acc + lead.value, 0);
  const activeContractsValue = activeClients.reduce((acc, client) => acc + client.value, 0);

  const stageColorMap = {
    Lead: "neutral" as const,
    Proposal: "info" as const,
    Negotiation: "warning" as const,
    Signed: "success" as const,
    Delivered: "success" as const,
    Lost: "danger" as const,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Studio Work"
        title="Leads & Clients Tracker"
        description="Monitor active studio client accounts, deal pipelines, and client-facing automation scopes."
        actions={
          <Badge variant="private">Private CRM</Badge>
        }
      />

      {/* Pipeline Widgets */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-brand-soft-black border-brand-graphite text-white">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-brand-muted-grey uppercase tracking-widest">
              Pipeline Value (Leads)
            </p>
            <div className="text-3xl font-extrabold text-white">
              ${totalPipelineValue.toLocaleString()}
            </div>
            <p className="text-xs text-brand-muted-grey">Estimated worth of active proposals.</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Signed Contracts Value
            </p>
            <div className="text-3xl font-bold text-neutral-900">
              ${activeContractsValue.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500">Active billed studio revenue.</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-warm-paper border-brand-muted-grey/20 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-brand-muted-grey uppercase tracking-wider">
              Active Accounts
            </p>
            <div className="text-3xl font-extrabold text-brand-orange">
              {activeClients.length}
            </div>
            <p className="text-xs text-brand-muted-grey">Currently active deployments.</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200 text-neutral-900">
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Open Proposals
            </p>
            <div className="text-3xl font-bold text-neutral-900">
              {pipelineLeads.filter((l) => l.stage === "Proposal").length}
            </div>
            <p className="text-xs text-neutral-500">Awaiting customer acceptance/feedback.</p>
          </CardContent>
        </Card>
      </div>

      {/* CRM Actions & Filters */}
      <div className="grid gap-3 p-4 rounded-lg border border-neutral-200 bg-white md:grid-cols-3 items-center">
        <div>
          <label htmlFor="crm-search" className="block text-xs font-bold text-neutral-500 uppercase mb-1">Search Account</label>
          <input
            id="crm-search"
            type="text"
            placeholder="e.g. Fes Tawsil, Casablanca"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 px-3 rounded border border-neutral-300 text-sm focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Account Filter</label>
          <div className="flex gap-1">
            {["All", "Active Client", "Lead (Pipeline)", "Archived"].map((stat) => (
              <button
                key={stat}
                onClick={() => setStatusFilter(stat)}
                className={`h-8 px-2.5 rounded text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  statusFilter === stat
                    ? "bg-brand-orange border-brand-orange text-white"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {stat === "Active Client" ? "Clients" : stat === "Lead (Pipeline)" ? "Pipeline" : stat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-5 md:pt-0">
          <button className="h-8 rounded bg-brand-soft-black hover:bg-brand-graphite px-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors">
            Add Client / Lead
          </button>
        </div>
      </div>

      {/* Accounts & Deals Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3 bg-neutral-50/50">
          <p className="text-sm font-semibold text-neutral-950">Accounts Ledger</p>
          <p className="mt-1 text-sm text-neutral-600">
            Current clients and leads under consideration.
          </p>
        </div>

        {filteredAccounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 font-semibold">
                <tr>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Account Name</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Automation Scope</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Deal Value</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Stage</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left">Progress / Likelihood</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right">Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-neutral-50/40">
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <div>
                        <p className="font-semibold text-neutral-950">{account.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{account.details}</p>
                      </div>
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 text-neutral-600 text-xs">
                      {account.automationScope}
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 font-semibold text-neutral-950">
                      ${account.value.toLocaleString()}
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <Badge variant={stageColorMap[account.stage]}>{account.stage}</Badge>
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-neutral-150 overflow-hidden bg-neutral-200">
                          <div
                            className={`h-full ${account.stage === "Lost" ? "bg-red-400" : "bg-brand-orange"}`}
                            style={{ width: `${account.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-700 font-semibold">{account.progress}%</span>
                      </div>
                    </td>
                    <td className="border-b border-neutral-100 px-4 py-3.5 text-right text-neutral-500 font-mono text-xs">
                      {account.lastContact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 text-sm">
            No accounts match the chosen filter constraints.
          </div>
        )}
      </div>
    </div>
  );
}
