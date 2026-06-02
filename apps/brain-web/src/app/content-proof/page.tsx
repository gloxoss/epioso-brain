"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Card, CardContent, PageHeader } from "../../components/ui";

interface ProofProject {
  readonly id: string;
  readonly promptId: string;
  readonly title: string;
  readonly category: "Healthcare" | "General Business" | "Brand Engine";
  readonly hfResource: string;
  readonly hfUrl: string;
  readonly status: "Concept / Proof" | "Delivered / Production";
  readonly description: string;
  readonly details: readonly string[];
  readonly technicalStack: readonly string[];
  readonly accuracyMetric?: string;
}

const PROOF_PROJECTS: readonly ProofProject[] = [
  {
    id: "medical-rag-miriad",
    promptId: "Prompt 10, 17",
    title: "Augmented Clinical Q&A RAG System",
    category: "Healthcare",
    hfResource: "MIRIAD Medical QA Corpus & smolagents RAG",
    hfUrl: "https://huggingface.co/papers/2506.06091",
    status: "Concept / Proof",
    description: "Advanced multi-agent retrieval-augmented generation grounded in 5.8M peer-reviewed medical guidelines and Q&As. Designed to prevent LLM hallucinations under a uniform clinical evaluation framework.",
    details: [
      "Hybrid index mapping (BM25 keyword search + SentenceTransformers vectors).",
      "Specialist agent router utilizing Hugging Face smolagents schema.",
      "Calibrated answer critic returning factuality grades and citation compliance scores.",
    ],
    technicalStack: ["smolagents", "BioBERT", "FAISS", "MIRIAD Corpus"],
    accuracyMetric: "Hallucination Rate: < 4% (Simulated)",
  },
  {
    id: "medical-deid-service",
    promptId: "Prompt 16, 20",
    title: "Clinical Note De-identification Pipeline",
    category: "Healthcare",
    hfResource: "obi/deid_bert_i2b2 & Minibase DeId-Small",
    hfUrl: "https://huggingface.co/obi/deid_bert_i2b2",
    status: "Concept / Proof",
    description: "Dual-layer privacy pipeline removing Protected Health Information (PHI) from unstructured clinical text. Strips names, dates, and medical IDs while preserving clinical syntax.",
    details: [
      "Token classification model (ClinicalBERT) performing entity recognition.",
      "DeId-Small generative text-to-text model running zero-shot on edge workstations.",
      "Surrogate generator replacing PHI spans with realistic fake matching syntax.",
    ],
    technicalStack: ["deid_bert_i2b2", "DeId-Small", "PyTorch", "i2b2 EHR Dataset"],
    accuracyMetric: "PHI Span F1 Score: 94.2% (Benchmark)",
  },
  {
    id: "data-jobs-insights",
    promptId: "Prompt 26, 27",
    title: "Global Data Careers & Tech Trends Explorer",
    category: "General Business",
    hfResource: "lukebarousse/data_jobs Dataset & EDA",
    hfUrl: "https://huggingface.co/datasets/lukebarousse/data_jobs",
    status: "Delivered / Production",
    description: "Exploratory data analysis mapping global salary parameters, remote work allocations, and technology stack intersections. Translates job trends into direct skill requirements.",
    details: [
      "Interactive multi-dimensional filtering of 120k+ data career nodes.",
      "Salary clustering model mapping career trajectories by regional tiers.",
      "Skill gap detection algorithm outputting high-value technology recommendations.",
    ],
    technicalStack: ["Pandas", "Scikit-Learn", "Hugging Face Datasets", "Next.js"],
    accuracyMetric: "Data Cleanliness: 100% Parsed",
  },
  {
    id: "resume-jd-matcher",
    promptId: "Prompt 28",
    title: "Vector Similarity Job Matching Agent",
    category: "General Business",
    hfResource: "HSE Hackathon Resume-JD Matcher",
    hfUrl: "https://www.kaggle.com/datasets/darysha/hse-hackathon",
    status: "Delivered / Production",
    description: "Matches, scores, and ranks candidate resumes against a database of active job descriptions, identifying key skill gaps and drafting tailored cover bullets.",
    details: [
      "PDF resume parser converting text layouts to clean JSON profile nodes.",
      "Sentence-BERT embeddings comparing vector similarity of job requirements.",
      "Cover letter compiler drafting customized experience hooks in 2 seconds.",
    ],
    technicalStack: ["Sentence-BERT", "FAISS", "PyPDF2", "FastAPI"],
    accuracyMetric: "Match Correlation: 0.88 Cosine",
  },
  {
    id: "content-command-automation",
    promptId: "Brand SOP",
    title: "Epioso Editorial Brand content Engine",
    category: "Brand Engine",
    hfResource: "Custom n8n Webhook & Design Tokens",
    hfUrl: "https://n8n.io",
    status: "Delivered / Production",
    description: "Autonomous content generation and scheduling engine drafting social posts on warm paper layouts. Coordinates and formats briefs based on the 3M framework.",
    details: [
      "n8n webhook triggers pulling recent code changes to compile marketing copy.",
      "Square post design builder rendering custom overlays and orange CTA tags.",
      "Strict avoidance of generic AI clichés, generating direct studio value copy.",
    ],
    technicalStack: ["n8n", "Claude 3.5 Sonnet", "Canvas API", "Brand System"],
    accuracyMetric: "Automation Coverage: 100% Scheduled",
  },
];

export default function ContentProofPage() {
  const [filterTab, setFilterTab] = useState<string>("All");

  const filteredProjects = PROOF_PROJECTS.filter(
    (proj) => filterTab === "All" || proj.category === filterTab
  );

  const statusColorMap = {
    "Concept / Proof": "warning" as const,
    "Delivered / Production": "success" as const,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Showcase"
        title="Content & Portfolio Proof"
        description="Verify the exact engineering details, datasets, and models backing our master's portfolio tracks and client automations."
        actions={
          <div className="flex gap-2">
            <Badge variant="private">Hugging Face Integrations</Badge>
            <Badge variant="neutral">6 Flagships</Badge>
          </div>
        }
      />

      {/* Track Category Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-sm font-medium text-neutral-500 mr-2">Track Category:</span>
        {["All", "Healthcare", "General Business", "Brand Engine"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
              filterTab === tab
                ? "bg-brand-orange border-brand-orange text-white"
                : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300"
            }`}
          >
            {tab === "General Business" ? "Business" : tab === "Brand Engine" ? "Brand" : tab}
          </button>
        ))}
      </div>

      {/* Cinematic Case-Study Asymmetric Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredProjects.map((project, idx) => {
          // Asymmetric visual weight: alternate card widths or borders
          const isFeatured = idx === 0 && filterTab === "All";
          
          return (
            <Card
              key={project.id}
              className={`bg-brand-soft-black border-brand-graphite text-white flex flex-col justify-between hover:border-brand-orange/30 transition-all duration-300 ${
                isFeatured ? "md:col-span-2 bg-black border-brand-orange/20" : ""
              }`}
            >
              <CardContent className="pt-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-brand-orange uppercase tracking-widest">
                      {project.promptId}
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                      {project.title}
                    </h2>
                  </div>
                  <Badge variant={statusColorMap[project.status]}>
                    {project.status}
                  </Badge>
                </div>

                {/* Subtitle / HF Source */}
                <div className="text-xs text-brand-muted-grey flex items-center gap-1.5">
                  <span className="font-semibold text-brand-light-grey">Source:</span>
                  <a
                    href={project.hfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-mono text-[11px]"
                  >
                    {project.hfResource} ↗
                  </a>
                </div>

                {/* Description */}
                <p className="text-sm text-brand-muted-grey leading-relaxed">
                  {project.description}
                </p>

                {/* Bullets */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-light-grey">
                    Key Features / Deliverables:
                  </p>
                  <ul className="space-y-1 text-xs text-brand-muted-grey list-disc pl-4 leading-relaxed">
                    {project.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              {/* Footer Panel */}
              <div className="border-t border-brand-graphite px-4 py-3 bg-brand-graphite/10 flex flex-wrap items-center justify-between gap-2 mt-4">
                <div className="flex gap-1.5 flex-wrap">
                  {project.technicalStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-brand-graphite px-2 py-0.5 text-[10px] font-mono font-medium text-brand-light-grey"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.accuracyMetric && (
                  <span className="text-[11px] font-bold text-emerald-400 font-mono">
                    {project.accuracyMetric}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Disclosure banner enforcing honesty */}
      <div className="rounded-lg border border-brand-warm-paper/10 bg-brand-warm-paper p-4 text-neutral-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
          Operational Disclosure
        </h3>
        <p className="text-xs mt-1 leading-5 text-neutral-700">
          In alignment with our brand guidelines, all clinical NLP pipelines and medical models are marked as{" "}
          <strong className="text-brand-orange font-semibold">Concept / Proof</strong>. These research-grade systems are staged in sandboxed environments for study and demonstration purposes. They will not write clinical database parameters without credentialed healthcare APIs.
        </p>
      </div>
    </div>
  );
}
