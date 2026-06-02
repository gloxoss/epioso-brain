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
  DataTable,
  PageHeader,
  type DataTableColumn,
} from "../../../components/ui";
import {
  mockMemorySources,
  mockMemoryItems,
  mockIndexingEvents,
  type MemorySource,
  type MemoryItem,
  type IndexingEvent,
} from "../../../lib/intelligence-mock-data";

interface PageProps {
  readonly params: Promise<{ id: string }>;
}

export default function MemoryDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [sources, setSources] = useState<readonly MemorySource[]>(mockMemorySources);
  const [items, setItems] = useState<readonly MemoryItem[]>(mockMemoryItems);
  const [isScanning, setIsScanning] = useState(false);

  const source = sources.find((s) => s.id === id);

  if (!source) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Memory Source Not Found</h2>
        <p className="text-sm text-neutral-500">The source ID "{id}" was not resolved in the registry.</p>
        <Link href="/memory">
          <Button>Back to Memory</Button>
        </Link>
      </div>
    );
  }

  const sourceItems = items.filter((i) => {
    // Basic filter simulation: link specific mock items to sources
    if (source.id === "mem-03") {
      return i.path.includes("/pre-dev/");
    }
    if (source.id === "mem-01") {
      return i.path.includes("/epioso-os-roadmap/");
    }
    return true;
  });

  const sourceEvents = mockIndexingEvents.filter((evt) => evt.sourceName === source.name);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSources((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                freshnessScore: 100,
                lastScan: new Date().toISOString(),
                status: "ok",
              }
            : s,
        ),
      );
      setItems((prev) =>
        prev.map((i) => (i.path.includes(source.path) ? { ...i, status: "fresh" } : i)),
      );
    }, 1200);
  };

  const handleDisable = () => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "error" ? "ok" : "stale" } : s)),
    );
  };

  const itemColumns: readonly DataTableColumn<MemoryItem>[] = [
    {
      key: "title",
      header: "Document Title",
      render: (row) => <span className="font-mono text-xs font-semibold text-neutral-950">{row.title}</span>,
    },
    {
      key: "type",
      header: "Format",
      render: (row) => (
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-mono uppercase text-neutral-500">
          {row.type}
        </span>
      ),
    },
    {
      key: "path",
      header: "Local Path",
      render: (row) => (
        <code className="block max-w-[280px] truncate font-mono text-xs text-neutral-500" title={row.path}>
          {row.path}
        </code>
      ),
    },
    {
      key: "linkedProject",
      header: "Project",
    },
    {
      key: "lastModified",
      header: "Last Modified",
      render: (row) => <span className="text-xs text-neutral-600">{new Date(row.lastModified).toLocaleDateString()}</span>,
    },
    {
      key: "status",
      header: "Freshness",
      render: (row) =>
        row.status === "fresh" ? (
          <Badge variant="success">Fresh</Badge>
        ) : (
          <Badge variant="warning">Stale</Badge>
        ),
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/memory" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#FF6B2D]">
              &larr; Memory Sources
            </Link>
            <span className="text-xs text-neutral-400">/</span>
            <span className="text-xs font-mono uppercase text-neutral-500">{source.type}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-neutral-950">{source.name}</h1>
          <p className="mt-1 text-sm text-neutral-500 font-mono">Path: {source.path}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleRescan} isLoading={isScanning} loadingLabel="Rescanning directory...">
            Rescan Source
          </Button>
          <Button variant="secondary" onClick={handleDisable}>
            {source.status === "error" ? "Enable Source" : "Toggle Status"}
          </Button>
          <Link href="/memory">
            <Button variant="subtle">Back</Button>
          </Link>
        </div>
      </div>

      {/* Metric strip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Indexed Chunks</p>
            <p className="text-2xl font-bold text-neutral-900">{source.indexedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Freshness</p>
            <p className="text-2xl font-bold text-emerald-600">{source.freshnessScore}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</p>
            <p className="text-2xl font-bold capitalize text-neutral-900">{source.status}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Linked Projects</p>
            <p className="text-2xl font-bold text-neutral-900">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Last Scanned</p>
            <p className="text-sm font-mono text-neutral-600 truncate">
              {new Date(source.lastScan).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Warm paper summary block */}
      <div className="bg-[#EDE8E4] border border-neutral-300 p-5 rounded-lg text-neutral-900 space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">Source Capability & Purpose</h2>
        <p className="text-sm leading-relaxed">{source.purpose}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main table of items */}
        <div className="space-y-4">
          <DataTable
            caption="Indexed Memory Documents"
            description={`All files and schema vectors matched in ${source.name}.`}
            columns={itemColumns}
            rows={sourceItems}
            getRowKey={(row) => row.id}
          />
        </div>

        {/* Side panel: History */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Source Log History</CardTitle>
            <CardDescription>Recent vector updates and errors for this target.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sourceEvents.length > 0 ? (
              <div className="space-y-4">
                {sourceEvents.map((evt) => (
                  <div key={evt.id} className="text-xs border-l-2 border-neutral-200 pl-3 py-0.5 space-y-1">
                    <div className="flex items-center justify-between text-neutral-500 font-mono">
                      <span>{evt.eventType.replace("_", " ").toUpperCase()}</span>
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-neutral-700 leading-normal">{evt.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">No sync logs recorded for this source.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
