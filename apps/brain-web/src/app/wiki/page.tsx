"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  PageHeader,
  type DataTableColumn,
} from "../../components/ui";
import {
  mockWikiPages,
  mockLintFindings,
  mockWikiOpenQuestions,
  type WikiPage,
  type LintFinding,
  type WikiOpenQuestion,
} from "../../lib/intelligence-mock-data";

export default function WikiMemoryPage() {
  const [pages, setPages] = useState<readonly WikiPage[]>(mockWikiPages);
  const [findings, setFindings] = useState<readonly LintFinding[]>(mockLintFindings);
  const [questions, setQuestions] = useState<readonly WikiOpenQuestion[]>(mockWikiOpenQuestions);
  const [isLinting, setIsLinting] = useState(false);
  const [lintProgress, setLintProgress] = useState(0);

  const totalPages = pages.length;
  const totalLinks = pages.reduce((acc, p) => acc + p.outgoingLinks.length, 0);
  const orphanCount = findings.filter((f) => f.type === "orphan").length;
  const staleCount = findings.filter((f) => f.type === "stale").length;
  const openQuestionsCount = questions.length;

  const handleRunLint = () => {
    setIsLinting(true);
    setLintProgress(10);
    const interval = setInterval(() => {
      setLintProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanningComplete();
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const setIsScanningComplete = () => {
    setIsLinting(false);
    // Add a new mock question or finding to simulate scanner
    setQuestions((current) => {
      if (current.some((q) => q.id === "wq-04")) return current;
      return [
        ...current,
        {
          id: "wq-04",
          pageId: "wiki-leverage",
          pageTitle: "AI Leverage Framework",
          question: "Has Oussama reviewed the 3M metrics spreadsheet for 2026?",
          contextNeeded: "Requires linking manual spreadsheet to /poc lab registry.",
        },
      ];
    });
  };

  const handleSolveFinding = (id: string) => {
    setFindings((current) => current.filter((f) => f.id !== id));
  };

  const handleAnswerQuestion = (id: string, answerText: string) => {
    if (!answerText) return;
    setQuestions((current) => current.filter((q) => q.id !== id));
    alert("Answer cached in memory indexes. Syncing to local Markdown file.");
  };

  const severityBadgeTones = {
    critical: "danger",
    warning: "warning",
    info: "neutral",
  } as const;

  const lintColumns: readonly DataTableColumn<LintFinding>[] = [
    {
      key: "pageTitle",
      header: "Wiki Page",
      render: (row) => <span className="font-semibold text-neutral-900">{row.pageTitle}</span>,
    },
    {
      key: "severity",
      header: "Severity",
      render: (row) => <Badge variant={severityBadgeTones[row.severity]}>{row.severity.toUpperCase()}</Badge>,
    },
    {
      key: "message",
      header: "Lint Finding",
    },
    {
      key: "id",
      header: "Action",
      render: (row) => (
        <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => handleSolveFinding(row.id)}>
          Resolve
        </Button>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        description="Local-first Markdown knowledge base browser, backlink compiler, and integrity check linter."
        eyebrow="MARKDOWN BRAIN / LINT"
        title="Wiki Memory"
        actions={
          <Button onClick={handleRunLint} isLoading={isLinting} loadingLabel="Running lint compilers...">
            Run Wiki Lint
          </Button>
        }
      />

      {isLinting && (
        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#FF6B2D] h-full transition-all duration-300"
            style={{ width: `${lintProgress}%` }}
          />
        </div>
      )}

      {/* KPI strip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Wiki Pages</p>
            <p className="text-3xl font-bold text-neutral-900">{totalPages}</p>
            <p className="text-xs text-neutral-500">Markdown sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Links</p>
            <p className="text-3xl font-bold text-neutral-900">{totalLinks}</p>
            <p className="text-xs text-neutral-500">Outgoing double links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Orphan Pages</p>
            <p className="text-3xl font-bold text-rose-600">{orphanCount}</p>
            <p className="text-xs text-neutral-500">No incoming links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Stale Pages</p>
            <p className="text-3xl font-bold text-amber-600">{staleCount}</p>
            <p className="text-xs text-neutral-500">Unreferenced for 90d+</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Open Questions</p>
            <p className="text-3xl font-bold text-neutral-900">{openQuestionsCount}</p>
            <p className="text-xs text-neutral-500">Awaiting context sync</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Side: Hub Page lists & Lint tables */}
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {pages.map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] text-neutral-500">Path: {p.sourcePath.split("/").pop()}</span>
                    <Badge variant={p.tags.includes("stale") ? "warning" : "success"}>
                      {p.tags.includes("stale") ? "Stale" : "Active"}
                    </Badge>
                  </div>
                  <CardTitle className="mt-1 text-base">
                    <Link href={`/wiki/${p.id}`} className="hover:text-[#FF6B2D] transition-colors">
                      {p.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-neutral-600 leading-normal">{p.summary}</p>

                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-neutral-100 text-xs">
                    <span className="text-neutral-500">Inbound: {p.backlinks.length}</span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-neutral-500">Outbound: {p.outgoingLinks.length}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DataTable
            caption="Wiki Compilation Warnings"
            description="Lint warnings showing orphan drafts and unresolved cross-links."
            columns={lintColumns}
            rows={findings}
            getRowKey={(row) => row.id}
          />
        </div>

        {/* Right Panel: Hot cache & missing questions */}
        <div className="space-y-6">
          {/* Hot Cache */}
          <Card>
            <CardHeader className="bg-[#EDE8E4]/50">
              <CardTitle>Hot Context Cache</CardTitle>
              <CardDescription>Most frequently referenced documents in recent active agent sessions.</CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div className="space-y-2.5">
                <div className="flex justify-between items-start font-mono">
                  <span className="font-bold text-neutral-900 truncate max-w-[200px]">06-agentos-prd-and-build-plan.md</span>
                  <Badge variant="success">98% hit</Badge>
                </div>
                <div className="flex justify-between items-start font-mono border-t border-neutral-100 pt-2">
                  <span className="font-bold text-neutral-900 truncate max-w-[200px]">epioso-ui.md</span>
                  <Badge variant="success">84% hit</Badge>
                </div>
                <div className="flex justify-between items-start font-mono border-t border-neutral-100 pt-2">
                  <span className="font-bold text-neutral-900 truncate max-w-[200px]">epioso-design.md</span>
                  <Badge variant="info">42% hit</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Missing-context questions */}
          <Card>
            <CardHeader>
              <CardTitle>Unanswered Brain Questions</CardTitle>
              <CardDescription>Context gaps the agent requested to resolve during workspace compiles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q.id} className="text-xs border-l-2 border-amber-500 pl-3 py-0.5 space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 font-bold">Source: {q.pageTitle}</span>
                        <p className="text-neutral-800 font-semibold leading-normal">{q.question}</p>
                      </div>
                      <div className="bg-neutral-50 p-2 rounded border border-neutral-100 text-[10px] text-neutral-500 font-mono">
                        Requires: {q.contextNeeded}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id={`ans-${q.id}`}
                          placeholder="Provide answer context..."
                          className="flex-1 rounded border border-neutral-300 px-2 py-0.5 text-xs text-neutral-800"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAnswerQuestion(q.id, (e.target as HTMLInputElement).value);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => {
                            const val = (document.getElementById(`ans-${q.id}`) as HTMLInputElement)?.value;
                            handleAnswerQuestion(q.id, val || "");
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">All context gaps resolved!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
