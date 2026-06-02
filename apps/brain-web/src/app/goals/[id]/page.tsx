"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge, Card, CardContent, CardHeader, CardTitle, Button } from "../../../components/ui";

interface Subtask {
  readonly id: string;
  readonly title: string;
  readonly status: "Concept / Proof" | "Delivered / Production" | "Not Started" | "In Progress";
  readonly type: "Academic Proof" | "Client Project" | "Infrastructure" | "Research";
  readonly hfDatasetOrModel?: string;
  readonly description: string;
  readonly progress: number;
}

interface GoalDetails {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly overallProgress: number;
  readonly targetDate: string;
  readonly description: string;
  readonly subtasks: readonly Subtask[];
  readonly businessImpact: string;
}

const GOALS_DETAIL_MAP: Record<string, GoalDetails> = {
  "academic-portfolio": {
    id: "academic-portfolio",
    title: "Master's AI/ML Portfolio Tracks",
    category: "Academic",
    overallProgress: 60,
    targetDate: "2026-06-30",
    description: "Build and document 6 flagship Hugging Face ML/DL portfolio projects covering clinical NLP, de-identification, and job application copilots.",
    businessImpact: "Provides deep-tech proof-of-concepts to show clients our capabilities in advanced RAG, privacy-compliant NLP, and automated workflow agents.",
    subtasks: [
      {
        id: "prompt-26-27",
        title: "Data-Related Job Postings: Trends & Insights (Prompt 26, 27)",
        status: "Delivered / Production",
        type: "Academic Proof",
        hfDatasetOrModel: "lukebarousse/data_jobs",
        description: "Comprehensive exploratory data analysis and trend modeling of global data jobs. Yields actionable insights on required tech stacks in 2026.",
        progress: 100,
      },
      {
        id: "prompt-28",
        title: "Resume-Job Matching & Ranking System (Prompt 28)",
        status: "Delivered / Production",
        type: "Academic Proof",
        hfDatasetOrModel: "Kaggle Resume-Job Matching",
        description: "Vector similarity ranking using Sentence-BERT to score resumes against job descriptions, suggesting skill gap modifications.",
        progress: 100,
      },
      {
        id: "prompt-10",
        title: "Medical RAG QA System with MIRIAD (Prompt 10)",
        status: "Concept / Proof",
        type: "Research",
        hfDatasetOrModel: "papers/2506.06091",
        description: "Retrieval-Augmented Generation grounded in the 5.8M medical QA pairs of the MIRIAD corpus. Formulated to verify and reduce LLM hallucinations in clinical context.",
        progress: 75,
      },
      {
        id: "prompt-16",
        title: "Clinical Note De-identification BERT (Prompt 16)",
        status: "Concept / Proof",
        type: "Research",
        hfDatasetOrModel: "obi/deid_bert_i2b2",
        description: "Token classification model (ClinicalBERT) fine-tuned for stripping Protected Health Information (PHI) like names, dates, and locations from medical records.",
        progress: 50,
      },
      {
        id: "prompt-17",
        title: "Multi-agent RAG System (Prompt 17)",
        status: "Concept / Proof",
        type: "Research",
        hfDatasetOrModel: "Hugging Face smolagents RAG",
        description: "Multi-agent coordinator where specialized router and specialist agents retrieve, critique, and draft responses from heterogeneous guidelines.",
        progress: 40,
      },
      {
        id: "prompt-20",
        title: "Tiny De-ID Text-to-Text Model (Prompt 20)",
        status: "Concept / Proof",
        type: "Research",
        hfDatasetOrModel: "Minibase DeId-Small",
        description: "Local-first privacy model utilizing DeId-Small to perform zero-shot and lightweight text sanitization directly on the user workstation.",
        progress: 20,
      },
    ],
  },
  "epioso-agency-redesign": {
    id: "epioso-agency-redesign",
    title: "Epioso IT Agency Website & Redesign",
    category: "Brand",
    overallProgress: 80,
    targetDate: "2026-07-15",
    description: "Launch the premium visual portfolio site utilizing our custom CSS tokens, bold typography, and cinematic project cards.",
    businessImpact: "Establishes brand recognition, attracts premium founders/businesses, and acts as the public gallery for our portfolio proofs.",
    subtasks: [
      {
        id: "brand-tokens",
        title: "Tailwind v4 Token Integration",
        status: "Delivered / Production",
        type: "Infrastructure",
        description: "Configure colors (#FF6B2D, #181818, #EDE8E4) and responsive layout rules in globals.css.",
        progress: 100,
      },
      {
        id: "portfolio-cards",
        title: "Cinematic Case Study Layout",
        status: "In Progress",
        type: "Client Project",
        description: "Construct rounded portfolio cards with hover scaling, overlays, and category badges.",
        progress: 85,
      },
      {
        id: "contact-panel",
        title: "Warm Paper Contact Form",
        status: "In Progress",
        type: "Client Project",
        description: "Implement large 'Get in Touch' layout with availability indicator dot and clear CTAs.",
        progress: 70,
      },
      {
        id: "seo-audits",
        title: "SEO and a11y Compliance Audits",
        status: "Not Started",
        type: "Research",
        description: "Run WCAG AA check and verify title tags/meta descriptions across all viewports.",
        progress: 0,
      },
    ],
  },
  "premium-clients": {
    id: "premium-clients",
    title: "Acquire 3 Premium Clients",
    category: "Revenue",
    overallProgress: 33,
    targetDate: "2026-08-01",
    description: "Close high-ticket contracts with Moroccan or international brands for web automation and custom IT solutions.",
    businessImpact: "Finances studio growth, gathers real customer data, and tests our local AgentOS pipelines under production parameters.",
    subtasks: [
      {
        id: "lead-pipeline",
        title: "Lead Scoring and Tracking Setup",
        status: "Delivered / Production",
        type: "Infrastructure",
        description: "Establish local leads board connecting projects to deal value and automation scopes.",
        progress: 100,
      },
      {
        id: "proposal-doc",
        title: "Epioso Pet Care Proposal & Devis",
        status: "In Progress",
        type: "Client Project",
        description: "Draft minimal warm-paper proposal detailing scope, SLA timelines, and budget table for the Pet Care lead.",
        progress: 90,
      },
      {
        id: "outreach-sprint",
        title: "Moroccan Service Provider Outreach",
        status: "In Progress",
        type: "Research",
        description: "Contact 10 targeted premium clinics, clinics, and agencies showing personalized automated proofs.",
        progress: 30,
      },
    ],
  },
  "agent-os-automation": {
    id: "agent-os-automation",
    title: "AgentOS Studio Automation",
    category: "Product",
    overallProgress: 50,
    targetDate: "2026-06-20",
    description: "Automate daily planning, n8n webhook sync, and model usage/cost reporting in the local dashboard.",
    businessImpact: "Reduces manual context-switching for Oussama, logs agent conversations, and visualizes token spend metrics.",
    subtasks: [
      {
        id: "dashboard-layout",
        title: "Next.js 16 Monorepo App Scaffold",
        status: "Delivered / Production",
        type: "Infrastructure",
        description: "Scaffold next app inside brain monorepo structure with components and initial routers.",
        progress: 100,
      },
      {
        id: "business-os-pages",
        title: "Business OS Core Pages",
        status: "In Progress",
        type: "Infrastructure",
        description: "Construct goals, costs, ROI, content proof, leads, and report pages with progress panels and filters.",
        progress: 90,
      },
      {
        id: "scan-adapters",
        title: "Folder and Skill Local Scanners",
        status: "Not Started",
        type: "Research",
        description: "Integrate gray-matter parsing of local skill folders and Git status check scripts.",
        progress: 0,
      },
    ],
  },
};

export default function GoalDetailPage() {
  const { id } = useParams();
  const goalId = typeof id === "string" ? id : "";
  const goal = GOALS_DETAIL_MAP[goalId];

  if (!goal) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Goal Not Found</h1>
        <p className="text-sm text-neutral-600">The goal ID "{goalId}" was not found in the local registry.</p>
        <Link href="/goals" className="inline-flex h-8 items-center rounded bg-emerald-950 px-3 text-xs font-semibold text-white">
          Back to Goals
        </Link>
      </div>
    );
  }

  const statusColorMap = {
    "Concept / Proof": "warning" as const,
    "Delivered / Production": "success" as const,
    "In Progress": "info" as const,
    "Not Started": "neutral" as const,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/goals"
          className="inline-flex h-8 items-center rounded border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
        >
          ← Back to Goals
        </Link>
        <Badge variant="private">Goal Detail</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Left column: Info and subtasks */}
        <div className="space-y-6">
          <Card className="bg-white border-neutral-200">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  {goal.category} Track
                </span>
                <span className="text-xs text-neutral-500 font-mono">Target: {goal.targetDate}</span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">{goal.title}</h1>
              <p className="text-base leading-relaxed text-neutral-700">{goal.description}</p>
              
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Business & Strategic Impact</p>
                <p className="text-sm text-neutral-600 bg-neutral-50 rounded-md border border-neutral-100 p-3">
                  {goal.businessImpact}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subtasks or Proof components */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">Track Sub-tasks & Concept Proofs</h2>
            
            <div className="space-y-3">
              {goal.subtasks.map((task) => (
                <Card key={task.id} className="bg-white border-neutral-200 hover:border-brand-orange/20 transition-all">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-neutral-950">{task.title}</h3>
                        {task.hfDatasetOrModel && (
                          <span className="inline-block text-[11px] font-mono text-brand-orange mt-0.5">
                            Dataset/Model: {task.hfDatasetOrModel}
                          </span>
                        )}
                      </div>
                      <Badge variant={statusColorMap[task.status]}>{task.status}</Badge>
                    </div>
                    
                    <p className="text-xs leading-5 text-neutral-600">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex-1">
                        <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className="h-full bg-brand-orange transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-neutral-500">{task.progress}% Complete</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Status details and progress panel */}
        <div className="space-y-6">
          <Card className="bg-brand-soft-black border-brand-graphite text-white">
            <CardHeader className="border-brand-graphite">
              <CardTitle className="text-white">Track Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <p className="text-xs text-brand-muted-grey uppercase tracking-wider">Overall Completion</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">{goal.overallProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-brand-graphite overflow-hidden">
                  <div
                    className="h-full bg-brand-orange transition-all"
                    style={{ width: `${goal.overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-brand-graphite pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-muted-grey">Total Deliverables</span>
                  <span className="font-semibold">{goal.subtasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted-grey">Completed / Shipped</span>
                  <span className="font-semibold text-emerald-400">
                    {goal.subtasks.filter((t) => t.status === "Delivered / Production" || t.progress === 100).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted-grey">Research / Proofs</span>
                  <span className="font-semibold text-amber-400">
                    {goal.subtasks.filter((t) => t.status === "Concept / Proof").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-warm-paper border-brand-muted-grey/20 text-neutral-900">
            <CardHeader className="border-brand-muted-grey/10">
              <CardTitle className="text-neutral-950 font-bold uppercase tracking-wider text-xs">Quality check</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-3">
              <p className="leading-5 text-neutral-700">
                To maintain learning ownership, every academic or model-generated system is checked against local code quality guidelines.
              </p>
              <div className="rounded border border-brand-muted-grey/20 bg-brand-paper-soft p-2.5 text-neutral-600">
                <p className="font-bold text-neutral-800">Review Status</p>
                <p className="mt-1">All concept work remains locked in local workspaces until security/privacy reviews are completed.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
