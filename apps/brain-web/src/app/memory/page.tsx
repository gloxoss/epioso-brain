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
  mockMemorySources,
  mockMemoryItems,
  mockIndexingEvents,
  type MemorySource,
  type MemoryItem,
  type IndexingEvent,
} from "../../lib/intelligence-mock-data";

export default function MemoryPage() {
  const [sources, setSources] = useState<readonly MemorySource[]>(mockMemorySources);
  const [items, setItems] = useState<readonly MemoryItem[]>(mockMemoryItems);
  const [events, setEvents] = useState<readonly IndexingEvent[]>(mockIndexingEvents);
  const [scanningId, setScanningId] = useState<string | null>(null);

  const totalSources = sources.length;
  const totalIndexedItems = sources.reduce((acc, s) => acc + s.indexedCount, 0);
  const staleNotesCount = items.filter((i) => i.status === "stale").length;
  const duplicateNotesCount = 2; // Fixed metric
  const avgFreshness = Math.round(sources.reduce((acc, s) => acc + s.freshnessScore, 0) / totalSources);

  const handleRescanSource = (id: string, name: string) => {
    setScanningId(id);
    // Add start event
    const startEvent: IndexingEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sourceName: name,
      eventType: "scan_start",
      message: `Triggered manual scan for source: ${name}`,
    };
    setEvents((prev) => [startEvent, ...prev]);

    setTimeout(() => {
      setScanningId(null);
      // Update freshness score and scan time
      setSources((prevSources) =>
        prevSources.map((s) =>
          s.id === id
            ? {
                ...s,
                freshnessScore: Math.min(s.freshnessScore + 10, 100),
                lastScan: new Date().toISOString(),
                status: s.status === "error" ? "ok" : s.status,
              }
            : s,
        ),
      );
      // Add complete event
      const completeEvent: IndexingEvent = {
        id: `evt-${Date.now() + 1}`,
        timestamp: new Date().toISOString(),
        sourceName: name,
        eventType: "scan_complete",
        message: `Successfully indexed files. Health restored to optimal state.`,
      };
      setEvents((prev) => [completeEvent, ...prev]);
    }, 1500);
  };

  const handleMarkItemReviewed = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "fresh", lastModified: new Date().toISOString() } : i)),
    );
  };

  const sourceStatusBadge = {
    ok: <Badge variant="success">Indexed</Badge>,
    stale: <Badge variant="warning">Stale</Badge>,
    error: <Badge variant="danger">Sync Error</Badge>,
  } as const;

  const staleColumns: readonly DataTableColumn<MemoryItem>[] = [
    {
      key: "title",
      header: "Note Name",
      render: (row) => <span className="font-mono text-xs font-semibold text-neutral-950">{row.title}</span>,
    },
    {
      key: "linkedProject",
      header: "Project Reference",
    },
    {
      key: "lastModified",
      header: "Last Modified",
      render: (row) => <span className="text-xs text-neutral-600">{new Date(row.lastModified).toLocaleDateString()}</span>,
    },
    {
      key: "status",
      header: "Stale Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => handleMarkItemReviewed(row.id)}>
          Mark Reviewed
        </Button>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        description="Inspect connected vaults, directories, vector collections, and index health files that feed developer context."
        eyebrow="KNOWLEDGE / CONTEXT HEALTH"
        title="Memory"
        actions={
          <Button onClick={() => alert("Connector wizard staged for next update.")}>
            Add Memory Source
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Connected Sources</p>
            <p className="text-3xl font-bold text-neutral-900">{totalSources}</p>
            <p className="text-xs text-neutral-500">Vaults & vector DBs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Indexed Items</p>
            <p className="text-3xl font-bold text-neutral-900">{totalIndexedItems}</p>
            <p className="text-xs text-neutral-500">Document chunks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Stale Notes</p>
            <p className="text-3xl font-bold text-amber-600">{staleNotesCount}</p>
            <p className="text-xs text-neutral-500">Outdated context alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Duplicate Notes</p>
            <p className="text-3xl font-bold text-rose-600">{duplicateNotesCount}</p>
            <p className="text-xs text-neutral-500">Redundant wiki pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Freshness Score</p>
            <p className="text-3xl font-bold text-emerald-600">{avgFreshness}%</p>
            <p className="text-xs text-neutral-500">Weighted average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Side: Sources Grid & Stale queue */}
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {sources.map((source) => (
              <Card key={source.id} className="relative overflow-hidden">
                {scanningId === source.id && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF6B2D] motion-safe:animate-pulse" />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        {source.type}
                      </span>
                      <CardTitle className="mt-0.5 text-base">{source.name}</CardTitle>
                    </div>
                    {sourceStatusBadge[source.status]}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1 font-mono text-xs">
                    <p className="truncate text-neutral-500" title={source.path}>
                      Path: {source.path}
                    </p>
                    <div className="flex justify-between text-neutral-600">
                      <span>Chunks: {source.indexedCount}</span>
                      <span>Freshness: {source.freshnessScore}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">{source.purpose}</p>

                  <div className="flex gap-2 pt-2 border-t border-neutral-100">
                    <Link
                      href={`/memory/${source.id}`}
                      className="inline-flex shrink-0 items-center justify-center h-8 px-3 rounded-md border border-neutral-300 bg-white text-xs font-medium text-neutral-900 hover:bg-neutral-50"
                    >
                      Inspect Source
                    </Link>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 text-xs"
                      onClick={() => handleRescanSource(source.id, source.name)}
                      isLoading={scanningId === source.id}
                      loadingLabel="Rescanning..."
                    >
                      Rescan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DataTable
            caption="Stale Context Queue"
            description="Pages and schema spec notes that haven't been referenced or updated in 90+ days."
            columns={staleColumns}
            rows={items.filter((i) => i.status === "stale")}
            getRowKey={(row) => row.id}
          />
        </div>

        {/* Right Side: Indexing Feed */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Recent Indexing Feed</CardTitle>
            <CardDescription>
              Automatic vectorization and directory scanning activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {events.map((evt) => (
                <div key={evt.id} className="text-xs border-l-2 border-neutral-200 pl-3 py-0.5 space-y-1">
                  <div className="flex items-center justify-between text-neutral-500 font-mono">
                    <span>{evt.sourceName}</span>
                    <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-neutral-800 leading-normal">{evt.message}</p>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {evt.eventType === "scan_complete" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                    {evt.eventType === "scan_start" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2D] motion-safe:animate-ping" />
                    )}
                    {evt.eventType === "error" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    )}
                    <span className="text-[10px] font-mono text-neutral-400 capitalize">
                      {evt.eventType.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
