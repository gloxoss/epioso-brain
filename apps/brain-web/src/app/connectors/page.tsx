"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "../../components/ui";

interface Connector {
  id: string;
  name: string;
  category: "Local" | "AI Providers" | "Memory" | "Automation" | "Research" | "Calendar" | "MCP";
  status: "connected" | "disconnected" | "error" | "needs_config";
  details: string;
  lastSync: string;
}

interface ConnectorEvent {
  id: string;
  timestamp: string;
  connectorName: string;
  type: "success" | "error" | "info";
  message: string;
}

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<Connector[]>([
    { id: "conn-1", name: "Local Workspace Scanner", category: "Local", status: "connected", details: "Scans project roots, git status", lastSync: "2026-06-02T02:22:00Z" },
    { id: "conn-2", name: "GitHub Repository Hook", category: "Local", status: "connected", details: "Fetches branches and PR state", lastSync: "2026-06-02T01:45:00Z" },
    { id: "conn-3", name: "LiteLLM API Gateway", category: "AI Providers", status: "connected", details: "Proxy and cost tracker", lastSync: "2026-06-02T02:10:00Z" },
    { id: "conn-4", name: "n8n Workflow Webhooks", category: "Automation", status: "connected", details: "n8n webhook triggers enabled", lastSync: "2026-06-02T02:30:00Z" },
    { id: "conn-5", name: "ChromaDB Vector Store", category: "Memory", status: "error", details: "Connection failed to 127.0.0.1:8000", lastSync: "2026-05-25T14:00:00Z" },
    { id: "conn-6", name: "Tavily AI Search Engine", category: "Research", status: "connected", details: "Queries internet context", lastSync: "2026-06-02T00:15:00Z" },
    { id: "conn-7", name: "Google Calendar Adapter", category: "Calendar", status: "needs_config", details: "OAuth credential required", lastSync: "Never" },
    { id: "conn-8", name: "Filesystem MCP Server", category: "MCP", status: "connected", details: "Exposes workspace directory nodes", lastSync: "2026-06-02T02:38:00Z" }
  ]);

  const [events, setEvents] = useState<ConnectorEvent[]>([
    { id: "evt-1", timestamp: "2026-06-02T02:38:00Z", connectorName: "Filesystem MCP Server", type: "info", message: "Initialized session. Allowed tools list parsed: read_file, write_file." },
    { id: "evt-2", timestamp: "2026-06-02T02:30:00Z", connectorName: "n8n Workflow Webhooks", type: "success", message: "Received trace log webhook from variant pipeline." },
    { id: "evt-3", timestamp: "2026-06-02T02:22:00Z", connectorName: "Local Workspace Scanner", type: "success", message: "Completed scan of D:/Users/zakio/Desktop/Work/Epioso/epioso-brain." },
    { id: "evt-4", timestamp: "2026-05-25T14:00:00Z", connectorName: "ChromaDB Vector Store", type: "error", message: "ECONNREFUSED: Target refused connection at port 8000." }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newConnName, setNewConnName] = useState("");
  const [newConnCategory, setNewConnCategory] = useState<Connector["category"]>("MCP");
  const [newConnDetails, setNewConnDetails] = useState("");

  const handleDisconnect = (id: string) => {
    setConnectors(
      connectors.map(c =>
        c.id === id ? { ...c, status: "disconnected" as const } : c
      )
    );
  };

  const handleReconnect = (id: string) => {
    setConnectors(
      connectors.map(c =>
        c.id === id ? { ...c, status: "connected" as const, lastSync: new Date().toISOString() } : c
      )
    );
  };

  const handleAddConnector = () => {
    if (!newConnName.trim()) return;
    setConnectors([
      ...connectors,
      {
        id: `conn-${connectors.length + 1}`,
        name: newConnName,
        category: newConnCategory,
        status: "needs_config",
        details: newConnDetails,
        lastSync: "Never"
      }
    ]);
    setShowAddDialog(false);
  };

  const categories: Connector["category"][] = ["Local", "AI Providers", "Memory", "Automation", "Research", "Calendar", "MCP"];

  return (
    <section className="space-y-6 bg-black p-6 md:p-8 rounded-xl border border-neutral-800 text-white min-h-[85vh]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          eyebrow="SYSTEM LINKS"
          title="Connectors"
          description="Manage API keys, directory credentials, databases, calendars, and active MCP server integrations."
          className="text-white"
        />
        <Button onClick={() => setShowAddDialog(true)} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black font-semibold h-10 px-5 rounded-md">
          Add Connector
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Main Grid grouped by Category */}
        <div className="space-y-6">
          {categories.map(cat => {
            const catConns = connectors.filter(c => c.category === cat);
            if (catConns.length === 0) return null;
            return (
              <div key={cat} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#FF6B2D] border-b border-neutral-800 pb-2">{cat} Connectors</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {catConns.map(c => (
                    <Card key={c.id} className="bg-[#181818] border-neutral-800 hover:border-neutral-700 transition-colors text-white">
                      <CardHeader className="border-neutral-800 flex flex-row items-center justify-between pb-2">
                        <div>
                          <CardTitle className="text-white text-base font-bold">{c.name}</CardTitle>
                          <CardDescription className="text-neutral-500 text-xs mt-0.5">{c.details}</CardDescription>
                        </div>
                        <Badge variant={c.status === "connected" ? "success" : c.status === "error" ? "danger" : c.status === "needs_config" ? "warning" : "neutral"}>
                          {c.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-2 pb-3 text-xs flex items-center justify-between">
                        <div>
                          <span className="text-neutral-500 block">Last Sync:</span>
                          <span className="font-mono text-neutral-300">{c.lastSync !== "Never" ? new Date(c.lastSync).toLocaleTimeString() : "Never"}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {c.status === "connected" ? (
                            <button
                              onClick={() => handleDisconnect(c.id)}
                              className="text-rose-500 hover:underline font-semibold"
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReconnect(c.id)}
                              className="text-emerald-500 hover:underline font-semibold"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right side: health diagnostics & recent sync events */}
        <div className="space-y-6">
          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white font-bold">Diagnostics</CardTitle>
              <CardDescription className="text-neutral-500">Sync status across integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Connected (Healthy)</span>
                  <Badge variant="success">{connectors.filter(c => c.status === "connected").length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Needs OAuth Setup</span>
                  <Badge variant="warning">{connectors.filter(c => c.status === "needs_config").length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Failures</span>
                  <Badge variant="danger">{connectors.filter(c => c.status === "error").length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-neutral-800 text-white">
            <CardHeader className="border-neutral-800">
              <CardTitle className="text-white">Recent Sync Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-800 font-mono text-[11px]">
                {events.map(e => (
                  <div key={e.id} className="p-3 space-y-1 hover:bg-neutral-900/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
                      <Badge variant={e.type === "success" ? "success" : e.type === "error" ? "danger" : "neutral"} className="text-[9px] py-0 h-4">
                        {e.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-neutral-300"><strong className="text-white">{e.connectorName}:</strong> {e.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for Add Connector */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-neutral-800 p-6 rounded-xl max-w-md w-full space-y-4">
            <h4 className="text-lg font-bold text-white">Add System Connector</h4>
            
            <div className="space-y-3 text-sm text-neutral-300">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Connector Name</label>
                <input
                  type="text"
                  placeholder="e.g. Qdrant Vector Store"
                  value={newConnName}
                  onChange={(e) => setNewConnName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Category</label>
                <select
                  value={newConnCategory}
                  onChange={(e) => setNewConnCategory(e.target.value as any)}
                  className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-sm"
                >
                  <option>Local</option>
                  <option>AI Providers</option>
                  <option>Memory</option>
                  <option>Automation</option>
                  <option>Research</option>
                  <option>Calendar</option>
                  <option>MCP</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Details / Endpoint</label>
                <input
                  type="text"
                  placeholder="e.g. http://127.0.0.1:6333"
                  value={newConnDetails}
                  onChange={(e) => setNewConnDetails(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddConnector} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black">
                  Create Connector
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
