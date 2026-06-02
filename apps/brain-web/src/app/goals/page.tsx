"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "../../components/ui";

interface Goal {
  readonly id: string;
  readonly title: string;
  readonly category: "Academic" | "Brand" | "Revenue" | "Product";
  readonly progress: number;
  readonly targetDate: string;
  readonly status: "Not Started" | "In Progress" | "Completed" | "Delayed";
  readonly description: string;
}

const GOALS_DATA: readonly Goal[] = [
  {
    id: "academic-portfolio",
    title: "Master's AI/ML Portfolio Tracks",
    category: "Academic",
    progress: 60,
    targetDate: "2026-06-30",
    status: "In Progress",
    description: "Build and document 6 flagship Hugging Face ML/DL portfolio projects (Clinical NLP, de-id, job tools).",
  },
  {
    id: "epioso-agency-redesign",
    title: "Epioso IT Agency Website & Redesign",
    category: "Brand",
    progress: 80,
    targetDate: "2026-07-15",
    status: "In Progress",
    description: "Deploy the new black/orange editorial digital studio website with portfolio case studies.",
  },
  {
    id: "premium-clients",
    title: "Acquire 3 Premium Clients",
    category: "Revenue",
    progress: 33,
    targetDate: "2026-08-01",
    status: "In Progress",
    description: "Close high-ticket contracts with Moroccan or international brands for web automation and custom IT solutions.",
  },
  {
    id: "agent-os-automation",
    title: "AgentOS Studio Automation",
    category: "Product",
    progress: 50,
    targetDate: "2026-06-20",
    status: "In Progress",
    description: "Automate daily planning, n8n webhook sync, and model usage/cost reporting in the local dashboard.",
  },
];

export default function GoalsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredGoals = GOALS_DATA.filter(
    (goal) => selectedCategory === "All" || goal.category === selectedCategory
  );

  const overallProgress = Math.round(
    GOALS_DATA.reduce((acc, goal) => acc + goal.progress, 0) / GOALS_DATA.length
  );

  const statusColorMap = {
    "Not Started": "neutral" as const,
    "In Progress": "info" as const,
    Completed: "success" as const,
    Delayed: "danger" as const,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Objectives"
        title="Goals & Milestones"
        description="Track strategic business targets, academic deadlines, and engineering sprints."
        actions={
          <div className="flex gap-2">
            <Badge variant="private">Private</Badge>
            <Badge variant="success">Active</Badge>
          </div>
        }
      />

      {/* Progress & Overview Panels */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-brand-soft-black border-brand-graphite text-white">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm font-medium text-brand-muted-grey uppercase tracking-widest">
              Overall Progress
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight text-white">
                {overallProgress}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-brand-graphite overflow-hidden">
              <div
                className="h-full bg-brand-orange transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-brand-muted-grey">
              Average completion across {GOALS_DATA.length} major system milestones.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200">
          <CardContent className="pt-6 space-y-2">
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Active Tracks
            </p>
            <div className="text-3xl font-bold text-neutral-900">
              {GOALS_DATA.filter((g) => g.status === "In Progress").length} / {GOALS_DATA.length}
            </div>
            <p className="text-sm text-neutral-600">
              Currently running operations with active agent loops.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-brand-warm-paper border-brand-muted-grey/20 text-neutral-900">
          <CardContent className="pt-6 space-y-2">
            <p className="text-sm font-medium text-brand-muted-grey uppercase tracking-wider">
              Next Critical Target
            </p>
            <div className="text-lg font-bold text-neutral-950 truncate">
              AgentOS Studio Automation
            </div>
            <div className="flex items-center justify-between text-xs text-brand-muted-grey">
              <span>Deadline: June 20, 2026</span>
              <span className="text-brand-orange font-semibold">18 Days Left</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-sm font-medium text-neutral-500 mr-2">Filters:</span>
        {["All", "Academic", "Brand", "Revenue", "Product"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
              selectedCategory === category
                ? "bg-brand-orange border-brand-orange text-white"
                : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Goals Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3 bg-neutral-50/50">
          <p className="text-sm font-semibold text-neutral-950">Active Milestones</p>
          <p className="mt-1 text-sm text-neutral-600">
            Strategic targets currently monitored by AgentOS.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 font-semibold">
              <tr>
                <th className="border-b border-neutral-200 px-4 py-3 text-left">Goal Title</th>
                <th className="border-b border-neutral-200 px-4 py-3 text-left">Category</th>
                <th className="border-b border-neutral-200 px-4 py-3 text-left">Progress</th>
                <th className="border-b border-neutral-200 px-4 py-3 text-left">Target Date</th>
                <th className="border-b border-neutral-200 px-4 py-3 text-left">Status</th>
                <th className="border-b border-neutral-200 px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGoals.map((goal) => (
                <tr key={goal.id} className="hover:bg-neutral-50/40">
                  <td className="border-b border-neutral-100 px-4 py-3.5">
                    <div>
                      <p className="font-semibold text-neutral-950">{goal.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                        {goal.description}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-neutral-100 px-4 py-3.5">
                    <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                      {goal.category}
                    </span>
                  </td>
                  <td className="border-b border-neutral-100 px-4 py-3.5 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                          className="h-full bg-brand-orange"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-neutral-700">{goal.progress}%</span>
                    </div>
                  </td>
                  <td className="border-b border-neutral-100 px-4 py-3.5 text-neutral-600 font-mono text-xs">
                    {goal.targetDate}
                  </td>
                  <td className="border-b border-neutral-100 px-4 py-3.5">
                    <Badge variant={statusColorMap[goal.status]}>{goal.status}</Badge>
                  </td>
                  <td className="border-b border-neutral-100 px-4 py-3.5 text-right">
                    <Link
                      href={`/goals/${goal.id}`}
                      className="inline-flex h-7 items-center rounded border border-neutral-300 bg-white px-2.5 text-xs font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                    >
                      View Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
