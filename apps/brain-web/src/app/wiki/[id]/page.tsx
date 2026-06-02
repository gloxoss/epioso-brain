"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "../../../components/ui";
import {
  mockWikiPages,
  mockLintFindings,
  mockWikiOpenQuestions,
  type WikiPage,
} from "../../../lib/intelligence-mock-data";

interface PageProps {
  readonly params: Promise<{ id: string }>;
}

export default function WikiDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [pages, setPages] = useState<readonly WikiPage[]>(mockWikiPages);
  const [questions, setQuestions] = useState(mockWikiOpenQuestions);

  const page = pages.find((p) => p.id === id);

  if (!page) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Wiki Page Not Found</h2>
        <p className="text-sm text-neutral-500">The wiki note with ID "{id}" was not resolved.</p>
        <Link href="/wiki">
          <Button>Back to Wiki Memory</Button>
        </Link>
      </div>
    );
  }

  const pageQuestions = questions.filter((q) => q.pageId === page.id);
  const pageFindings = mockLintFindings.filter((lf) => lf.pageId === page.id);

  const handleRefreshSummary = () => {
    alert("Re-indexing file content chunks and summarizing via LLM API.");
  };

  const handleMarkReviewed = () => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              lastModified: new Date().toISOString(),
            }
          : p,
      ),
    );
    alert("Note freshness flag reset. Local metadata updated.");
  };

  const handleAnswerQuestion = (qId: string, answerText: string) => {
    if (!answerText) return;
    setQuestions((current) => current.filter((q) => q.id !== qId));
    alert("Answer saved to Markdown note header properties.");
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/wiki" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#FF6B2D]">
              &larr; Wiki Index
            </Link>
            <span className="text-xs text-neutral-400">/</span>
            <span className="text-xs font-mono uppercase text-neutral-500">{page.id}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-neutral-950">{page.title}</h1>
          <p className="mt-1 text-sm text-neutral-500 font-mono">Source file: {page.sourcePath}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleRefreshSummary}>
            Refresh Summary
          </Button>
          <Button variant="secondary" onClick={handleMarkReviewed}>
            Mark Reviewed
          </Button>
          <Link href="/wiki">
            <Button variant="subtle">Back</Button>
          </Link>
        </div>
      </div>

      {/* Main warm paper document preview and sidebars */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Side: Markdown warm paper preview */}
        <div className="space-y-6">
          <Card className="bg-[#EDE8E4] border-neutral-350 text-neutral-900 overflow-hidden">
            <CardHeader className="bg-neutral-950/5 border-b border-neutral-300 py-3">
              <div className="flex justify-between items-center text-xs font-mono text-neutral-700">
                <span>PREVIEW MODE: SOURCE READ</span>
                <span>Last compiled: {new Date(page.lastModified).toLocaleDateString()}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-5 pb-8 px-6 font-sans">
              <div className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-4">
                <h1 className="text-xl font-bold text-neutral-900 border-b border-neutral-300 pb-2">{page.title}</h1>
                <p className="italic text-neutral-700 bg-neutral-950/5 p-3 rounded border border-neutral-200">
                  <strong>Brief Summary:</strong> {page.summary}
                </p>
                <div className="font-mono text-xs whitespace-pre-wrap bg-white/70 p-4 rounded border border-neutral-300 text-neutral-800">
                  {page.contentSnippet}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom panel: unanswered questions */}
          {pageQuestions.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="py-3">
                <CardTitle className="text-amber-800 text-xs uppercase tracking-wider font-bold">Unresolved Context Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {pageQuestions.map((q) => (
                  <div key={q.id} className="text-xs space-y-2">
                    <div>
                      <p className="font-semibold text-neutral-900">{q.question}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">Needed: {q.contextNeeded}</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id={`detail-ans-${q.id}`}
                        placeholder="Type answer here..."
                        className="flex-1 rounded border border-neutral-300 px-2.5 py-1 text-xs text-neutral-800 bg-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAnswerQuestion(q.id, (e.target as HTMLInputElement).value);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => {
                          const val = (document.getElementById(`detail-ans-${q.id}`) as HTMLInputElement)?.value;
                          handleAnswerQuestion(q.id, val || "");
                        }}
                      >
                        Submit Context
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side Panels: links & lint */}
        <div className="space-y-4 text-xs">
          {/* Backlinks */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Inbound Backlinks</CardTitle>
              <CardDescription>Other wiki notes referencing this file.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {page.backlinks.length > 0 ? (
                page.backlinks.map((link) => (
                  <Link
                    href={`/wiki/${link.id}`}
                    key={link.id}
                    className="block p-1.5 hover:bg-neutral-50 rounded text-neutral-700 font-semibold hover:text-[#FF6B2D]"
                  >
                    [[{link.title}]]
                  </Link>
                ))
              ) : (
                <p className="text-neutral-500 italic py-1">No incoming links found.</p>
              )}
            </CardContent>
          </Card>

          {/* Outgoing links */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Outgoing Wiki Links</CardTitle>
              <CardDescription>Notes referenced inside this file body.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {page.outgoingLinks.length > 0 ? (
                page.outgoingLinks.map((link) => (
                  <Link
                    href={`/wiki/${link.id}`}
                    key={link.id}
                    className="block p-1.5 hover:bg-neutral-50 rounded text-neutral-700 font-semibold hover:text-[#FF6B2D]"
                  >
                    [[{link.title}]]
                  </Link>
                ))
              ) : (
                <p className="text-neutral-500 italic py-1">No outgoing links declared.</p>
              )}
            </CardContent>
          </Card>

          {/* Lint warnings */}
          {pageFindings.length > 0 && (
            <Card className="border-rose-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-rose-700">Page Lint Warnings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {pageFindings.map((lf) => (
                  <div key={lf.id} className="p-2 rounded bg-rose-500/5 border border-rose-500/10 text-neutral-700 leading-normal">
                    {lf.message}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
