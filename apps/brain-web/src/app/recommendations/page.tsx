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
  PageHeader,
} from "../../components/ui";
import { mockRecommendations, type Recommendation } from "../../lib/intelligence-mock-data";

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<readonly Recommendation[]>(mockRecommendations);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"All" | "Cost" | "Skill" | "Memory" | "Workflow">("All");

  const openCount = recs.filter((r) => r.status === "Open").length;
  const acceptedCount = recs.filter((r) => r.status === "Accepted").length;
  const doneCount = recs.filter((r) => r.status === "Done").length;
  const dismissedCount = recs.filter((r) => r.status === "Dismissed").length;
  const highPriorityCount = recs.filter((r) => r.confidence >= 90 && r.status === "Open").length;

  const handleRunReview = () => {
    setIsReviewing(true);
    setReviewProgress(5);
    const interval = setInterval(() => {
      setReviewProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReviewing(false);
          // Add a new mock recommendation
          setRecs((current) => {
            if (current.some((r) => r.id === "rec-06")) return current;
            return [
              ...current,
              {
                id: "rec-06",
                title: "Decommission unused patients-lint skill",
                category: "Skill",
                reason: "This skill has not been used or modified in 92 days, and is marked as legacy.",
                evidence: "Found sk-06 (epioso-logics-patient-schema-lint) with 0 active usages in the last 60 days.",
                hoursSaved: 1,
                actionSteps: [
                  "Verify that no running n8n pipelines depend on patient-schema-lint.",
                  "Archive the skill definition file to .skills/archive/.",
                  "Rescan skills database."
                ],
                confidence: 91,
                status: "Open",
                date: new Date().toISOString()
              }
            ];
          });
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleStatusChange = (id: string, nextStatus: "Accepted" | "Done" | "Dismissed" | "Open") => {
    setRecs((current) =>
      current.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
  };

  const filteredRecs = recs.filter((r) => activeTab === "All" || r.category === activeTab);

  const categoryBadgeColors = {
    Cost: "success",
    Skill: "info",
    Memory: "neutral",
    Workflow: "warning",
    Security: "danger"
  } as const;

  const rules = [
    {
      name: "Skill Duplication",
      desc: "Triggered when 2+ skills share >80% code similarity or matching function names."
    },
    {
      name: "Stale Memory Drift",
      desc: "Triggers when index notes are unmodified for 90+ days while code changes active."
    },
    {
      name: "Model Quota Mismatch",
      desc: "Triggers when premium models (GPT-4o) run on simple static scripts."
    },
    {
      name: "Cadence Failure Loop",
      desc: "Triggers when daily loops or status scans fail to run for 2 consecutive cycles."
    },
    {
      name: "Local Secret Leak",
      desc: "High priority warning when uncommitted keys/tokens are staged in git index."
    }
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        description="Deterministic review recommendations generated from workspace folder scans, token cost limits, and session activity logs."
        eyebrow="DREAM RUN / NEXT ACTIONS"
        title="Recommendations"
        actions={
          <Button onClick={handleRunReview} isLoading={isReviewing} loadingLabel="Analyzing workspace signals...">
            Run Review
          </Button>
        }
      />

      {isReviewing && (
        <div className="space-y-2">
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#FF6B2D] h-full transition-all duration-300"
              style={{ width: `${reviewProgress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 font-mono">
            Reading projects, skills, sessions, and costs... {reviewProgress}%
          </p>
        </div>
      )}

      {/* KPI strip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Open Actions</p>
            <p className="text-3xl font-bold text-neutral-900">{openCount}</p>
            <p className="text-xs text-neutral-500">Awaiting your approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Accepted</p>
            <p className="text-3xl font-bold text-[#FF6B2D]">{acceptedCount}</p>
            <p className="text-xs text-neutral-500">Staged for execution</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Completed</p>
            <p className="text-3xl font-bold text-emerald-600">{doneCount}</p>
            <p className="text-xs text-neutral-500">Verified saved leverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Dismissed</p>
            <p className="text-3xl font-bold text-neutral-400">{dismissedCount}</p>
            <p className="text-xs text-neutral-500">Snoozed or archive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">High Priority</p>
            <p className="text-3xl font-bold text-rose-600">{highPriorityCount}</p>
            <p className="text-xs text-neutral-500">Confidence score &gt;90%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main list */}
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-neutral-200 pb-2">
            {(["All", "Cost", "Skill", "Memory", "Workflow"] as const).map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-[#FF6B2D] text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredRecs.length > 0 ? (
              filteredRecs.map((rec) => (
                <Card
                  key={rec.id}
                  className={`border-l-4 transition-colors ${
                    rec.status === "Accepted"
                      ? "border-l-[#FF6B2D]"
                      : rec.status === "Done"
                        ? "border-l-emerald-600"
                        : rec.status === "Dismissed"
                          ? "border-l-neutral-300"
                          : rec.confidence >= 90
                            ? "border-l-rose-500"
                            : "border-l-neutral-400"
                  }`}
                >
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={categoryBadgeColors[rec.category as keyof typeof categoryBadgeColors]}>
                          {rec.category}
                        </Badge>
                        <span className="text-xs font-mono text-neutral-500">Conf: {rec.confidence}%</span>
                      </div>
                      <span className="text-xs text-neutral-500">{new Date(rec.date).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">{rec.title}</h3>
                      <p className="mt-1 text-xs text-neutral-600">{rec.reason}</p>
                    </div>

                    <div className="bg-neutral-50 p-2.5 rounded border border-neutral-150 text-xs font-mono text-neutral-600">
                      <strong>Signal Evidence:</strong> {rec.evidence}
                      {rec.costSaved && <span className="ml-3 text-emerald-700 font-bold">Est. Savings: {rec.costSaved}</span>}
                      {rec.hoursSaved && <span className="ml-3 text-emerald-700 font-bold">Est. Time Saved: {rec.hoursSaved}h</span>}
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-neutral-700">Recommended Action Steps:</p>
                      <ul className="list-decimal list-inside text-xs text-neutral-600 space-y-1">
                        {rec.actionSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-neutral-100 justify-end">
                      {rec.status === "Open" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-[#FF6B2D] hover:bg-[#E85A1F] border-[#FF6B2D]"
                            onClick={() => handleStatusChange(rec.id, "Accepted")}
                          >
                            Accept Action
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleStatusChange(rec.id, "Dismissed")}>
                            Dismiss
                          </Button>
                        </>
                      )}
                      {rec.status === "Accepted" && (
                        <>
                          <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600" onClick={() => handleStatusChange(rec.id, "Done")}>
                            Mark Done
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleStatusChange(rec.id, "Open")}>
                            Revert to Open
                          </Button>
                        </>
                      )}
                      {(rec.status === "Done" || rec.status === "Dismissed") && (
                        <Button size="sm" variant="secondary" onClick={() => handleStatusChange(rec.id, "Open")}>
                          Reopen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-neutral-500 py-6 text-center">No recommendations in this category.</p>
            )}
          </div>
        </div>

        {/* Side panel: Rule explanations */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>System Run Rules</CardTitle>
            <CardDescription>
              Rules evaluated during the dream review loops to generate action signals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="divide-y divide-neutral-200">
              {rules.map((rule) => (
                <div key={rule.name} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <p className="text-xs font-bold text-neutral-900">{rule.name}</p>
                  <p className="text-xs text-neutral-500 leading-normal">{rule.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
