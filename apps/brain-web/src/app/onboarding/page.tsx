"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "../../components/ui";

interface OnboardingState {
  providers: { id: string; name: string; enabled: boolean }[];
  monthlyCost: number;
  memorySources: { path: string; type: string }[];
  skillFolders: string[];
  projectFolders: string[];
  hourlyRate: number;
  dreamSchedule: string;
  privacyMode: "local-first" | "restricted" | "air-gapped";
}

const STEP_NAMES = [
  "AI Tools & Providers",
  "Subscriptions & Costs",
  "Memory & Knowledge",
  "Skill Directories",
  "Project Workspaces",
  "Hourly ROI Assumptions",
  "Dream Engine Schedule",
  "Security & Activation"
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<OnboardingState>({
    providers: [
      { id: "claude-code", name: "Claude Code CLI", enabled: true },
      { id: "codex", name: "Codex Editor Agent", enabled: true },
      { id: "gemini-cli", name: "Gemini Developer CLI", enabled: true },
      { id: "ollama", name: "Ollama Local Models", enabled: false },
      { id: "litellm", name: "LiteLLM API Proxy", enabled: true }
    ],
    monthlyCost: 80,
    memorySources: [
      { path: "D:/Users/zakio/Desktop/Work/Epioso/notes", type: "Obsidian Vault" },
      { path: "D:/Users/zakio/Desktop/Work/Epioso/epioso-brain/docs", type: "Project Markdown" }
    ],
    skillFolders: ["C:/Users/oussama/.gemini/config/skills", "D:/Users/zakio/Desktop/Work/Epioso/.agents/skills"],
    projectFolders: ["D:/Users/zakio/Desktop/Work/Epioso/epioso-brain", "D:/Users/zakio/Desktop/Work/Epioso/epioso-web"],
    hourlyRate: 75,
    dreamSchedule: "0 8 * * * (Every morning at 8:00 AM)",
    privacyMode: "local-first"
  });

  const [inputProvider, setInputProvider] = useState("");
  const [inputMemoryPath, setInputMemoryPath] = useState("");
  const [inputMemoryType, setInputMemoryType] = useState("Markdown Wiki");
  const [inputSkillPath, setInputSkillPath] = useState("");
  const [inputProjectPath, setInputProjectPath] = useState("");

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleToggleProvider = (id: string) => {
    setState({
      ...state,
      providers: state.providers.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
    });
  };

  const addProvider = () => {
    if (!inputProvider.trim()) return;
    const id = inputProvider.toLowerCase().replace(/\s+/g, "-");
    setState({
      ...state,
      providers: [...state.providers, { id, name: inputProvider, enabled: true }]
    });
    setInputProvider("");
  };

  const addMemorySource = () => {
    if (!inputMemoryPath.trim()) return;
    setState({
      ...state,
      memorySources: [...state.memorySources, { path: inputMemoryPath, type: inputMemoryType }]
    });
    setInputMemoryPath("");
  };

  const removeMemorySource = (index: number) => {
    setState({
      ...state,
      memorySources: state.memorySources.filter((_, i) => i !== index)
    });
  };

  const addSkillFolder = () => {
    if (!inputSkillPath.trim()) return;
    setState({
      ...state,
      skillFolders: [...state.skillFolders, inputSkillPath]
    });
    setInputSkillPath("");
  };

  const removeSkillFolder = (index: number) => {
    setState({
      ...state,
      skillFolders: state.skillFolders.filter((_, i) => i !== index)
    });
  };

  const addProjectFolder = () => {
    if (!inputProjectPath.trim()) return;
    setState({
      ...state,
      projectFolders: [...state.projectFolders, inputProjectPath]
    });
    setInputProjectPath("");
  };

  const removeProjectFolder = (index: number) => {
    setState({
      ...state,
      projectFolders: state.projectFolders.filter((_, i) => i !== index)
    });
  };

  return (
    <section className="space-y-6 bg-black p-6 md:p-8 rounded-xl border border-neutral-800 text-white min-h-[80vh]">
      <PageHeader
        eyebrow="SYSTEM CONFIGURATION"
        title="AgentOS Onboarding"
        description="Configure your private AI operating system boundaries and data sources. All configuration stays local-first on this machine."
        className="text-white"
      />

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr_20rem]">
        {/* Left progress rail */}
        <div className="space-y-2 border-r border-neutral-800 pr-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">SETUP PROGRESS</p>
          {STEP_NAMES.map((name, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (
              <button
                key={name}
                onClick={() => setCurrentStep(idx)}
                className={`w-full text-left p-2.5 rounded text-sm transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-[#242424] text-[#FF6B2D] font-medium border-l-2 border-[#FF6B2D]"
                    : isCompleted
                    ? "text-[#FF6B2D]/80 hover:bg-[#181818]"
                    : "text-neutral-500 hover:bg-[#181818]"
                }`}
              >
                <span className={`inline-flex items-center justify-center size-5 rounded-full text-xs ${
                  isActive ? "bg-[#FF6B2D] text-black" : isCompleted ? "bg-[#FF6B2D]/20 text-[#FF6B2D]" : "bg-neutral-800 text-neutral-500"
                }`}>
                  {idx + 1}
                </span>
                <span className="truncate">{name}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Warm Paper Setup Card */}
        <div className="bg-[#EDE8E4] text-neutral-950 p-6 md:p-8 rounded-xl flex flex-col justify-between shadow-lg">
          <div className="space-y-6">
            <div className="border-b border-neutral-300 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Step {currentStep + 1} of 8</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">{STEP_NAMES[currentStep]}</h2>
            </div>

            {/* Step 1: AI Tools/Providers */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Select and configure the AI systems and runtimes active in your studio. This enables AgentOS to track capabilities and estimate equivalent costs.
                </p>
                <div className="space-y-2.5">
                  {state.providers.map(p => (
                    <label key={p.id} className="flex items-center justify-between p-3 bg-white/70 border border-neutral-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      <span className="font-semibold text-neutral-900">{p.name}</span>
                      <input
                        type="checkbox"
                        checked={p.enabled}
                        onChange={() => handleToggleProvider(p.id)}
                        className="accent-[#FF6B2D] size-4 rounded"
                      />
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Custom Tool (e.g. n8n workflow)"
                    value={inputProvider}
                    onChange={(e) => setInputProvider(e.target.value)}
                    className="flex-1 bg-white border border-neutral-300 rounded px-3 py-1.5 text-sm"
                  />
                  <Button variant="secondary" onClick={addProvider}>Add</Button>
                </div>
              </div>
            )}

            {/* Step 2: Subscriptions & Cost Assumptions */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Set your monthly subscription costs and API billing estimates. These are used to calculate AI tool efficiencies and net ROI.
                </p>
                <div className="bg-white p-4 border border-neutral-300 rounded-lg space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Estimated Monthly AI Spend ($)</label>
                    <input
                      type="number"
                      value={state.monthlyCost}
                      onChange={(e) => setState({ ...state, monthlyCost: Number(e.target.value) })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 font-mono"
                    />
                  </div>
                  <div className="text-xs text-neutral-500 leading-normal">
                    Includes plans like ChatGPT Plus ($20), Claude Pro ($20), OpenRouter API buffers ($20), and local server electricity buffer ($20).
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Memory Sources */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Register folder paths containing Obsidian notes, project wikis, and design system documents. AgentOS indexers scan these locally.
                </p>
                <div className="space-y-2">
                  {state.memorySources.map((ms, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-neutral-300 rounded-lg text-sm">
                      <div className="min-w-0">
                        <span className="font-mono text-xs text-neutral-500 block">{ms.type}</span>
                        <span className="font-medium text-neutral-900 truncate block">{ms.path}</span>
                      </div>
                      <button onClick={() => removeMemorySource(idx)} className="text-rose-700 font-semibold text-xs hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-4 border border-neutral-300 rounded-lg space-y-3">
                  <div className="grid gap-2 grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Source Type</label>
                      <select
                        value={inputMemoryType}
                        onChange={(e) => setInputMemoryType(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded px-2 py-1.5 text-xs"
                      >
                        <option>Obsidian Vault</option>
                        <option>Markdown Wiki</option>
                        <option>Project Docs Folder</option>
                        <option>Vector Database</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Folder Path</label>
                      <input
                        type="text"
                        placeholder="D:/Users/zakio/Desktop/..."
                        value={inputMemoryPath}
                        onChange={(e) => setInputMemoryPath(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                  <Button variant="secondary" onClick={addMemorySource} className="w-full text-xs">Add Memory Source</Button>
                </div>
              </div>
            )}

            {/* Step 4: Skill Directories */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Register your agent capability skill folders. AgentOS parses `.md` and `.yaml` skills using conventions to display active capacities on the main dashboard.
                </p>
                <div className="space-y-2">
                  {state.skillFolders.map((path, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-neutral-300 rounded-lg text-sm">
                      <span className="font-mono text-xs text-neutral-800 truncate block mr-4">{path}</span>
                      <button onClick={() => removeSkillFolder(idx)} className="text-rose-700 font-semibold text-xs hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="C:/Users/oussama/.gemini/config/skills"
                    value={inputSkillPath}
                    onChange={(e) => setInputSkillPath(e.target.value)}
                    className="flex-1 bg-white border border-neutral-300 rounded px-3 py-1.5 text-xs"
                  />
                  <Button variant="secondary" onClick={addSkillFolder}>Add Path</Button>
                </div>
              </div>
            )}

            {/* Step 5: Project Workspaces */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Register the root paths of active workspace projects. Local monitors scan Git states, staging directories, and project-specific tasks.
                </p>
                <div className="space-y-2">
                  {state.projectFolders.map((path, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-neutral-300 rounded-lg text-sm">
                      <span className="font-mono text-xs text-neutral-800 truncate block mr-4">{path}</span>
                      <button onClick={() => removeProjectFolder(idx)} className="text-rose-700 font-semibold text-xs hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="D:/Users/zakio/Desktop/Work/..."
                    value={inputProjectPath}
                    onChange={(e) => setInputProjectPath(e.target.value)}
                    className="flex-1 bg-white border border-neutral-300 rounded px-3 py-1.5 text-xs"
                  />
                  <Button variant="secondary" onClick={addProjectFolder}>Add Workspace</Button>
                </div>
              </div>
            )}

            {/* Step 6: Hourly ROI Assumptions */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Define your development billing rate and efficiency assumptions. AgentOS uses this to estimate dollar value saved per hour of automated/assisted work.
                </p>
                <div className="bg-white p-4 border border-neutral-300 rounded-lg space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Developer Hourly Rate ($/hr)</label>
                    <input
                      type="number"
                      value={state.hourlyRate}
                      onChange={(e) => setState({ ...state, hourlyRate: Number(e.target.value) })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 font-mono"
                    />
                  </div>
                  <div className="text-xs text-neutral-500 leading-normal">
                    If an agent saves you 5 hours, this is valued at <span className="font-bold text-neutral-900">${5 * state.hourlyRate}</span> gross savings.
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Dream Engine Schedule */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  The Dream Engine analyzes local workspace files, git logs, and agent activity periodically to formulate recommendations (e.g. repeated task alerts, missing skills).
                </p>
                <div className="bg-white p-4 border border-neutral-300 rounded-lg space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Analysis Cron Pattern</label>
                    <input
                      type="text"
                      value={state.dreamSchedule}
                      onChange={(e) => setState({ ...state, dreamSchedule: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 font-mono"
                    />
                  </div>
                  <div className="text-xs text-neutral-500 leading-normal">
                    Standard Unix cron pattern. Default triggers once every morning before work begins.
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Security & Activation */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Configure local-first safety policies. These prevent agents from writing files or making external web calls without explicit approval.
                </p>
                <div className="bg-white p-4 border border-neutral-300 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-700 uppercase">Local Safety Posture</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="privacy"
                          checked={state.privacyMode === "local-first"}
                          onChange={() => setState({ ...state, privacyMode: "local-first" })}
                          className="accent-[#FF6B2D]"
                        />
                        <div>
                          <span className="font-semibold block text-sm">Local-First Sandbox</span>
                          <span className="text-xs text-neutral-500">Local SQLite storage. Safe command approvals required.</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="privacy"
                          checked={state.privacyMode === "restricted"}
                          onChange={() => setState({ ...state, privacyMode: "restricted" })}
                          className="accent-[#FF6B2D]"
                        />
                        <div>
                          <span className="font-semibold block text-sm">Strict Air-Gapped</span>
                          <span className="text-xs text-neutral-500">Block all outbound web requests from agent tasks entirely.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-neutral-300 pt-4 mt-8">
            <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            {currentStep < 7 ? (
              <Button onClick={handleNext} className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black">
                Continue
              </Button>
            ) : (
              <Link href="/">
                <Button className="bg-[#FF6B2D] border-[#FF6B2D] hover:bg-[#E85A1F] text-black">
                  Activate AgentOS
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Right side live summary */}
        <div className="bg-[#181818] border border-neutral-800 p-5 rounded-xl space-y-5 text-sm h-fit">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF6B2D]">LIVE CONFIG SUMMARY</p>
          
          <div className="space-y-4 divide-y divide-neutral-800">
            <div className="space-y-1">
              <span className="text-xs text-neutral-500 block">CONNECTED PROVIDERS</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {state.providers.filter(p => p.enabled).map(p => (
                  <Badge key={p.id} variant="neutral" className="bg-neutral-800 text-neutral-200 border-neutral-700">
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-3">
              <span className="text-xs text-neutral-500 block">EST. BUDGET ASSUMPTION</span>
              <span className="font-mono text-white text-base">${state.monthlyCost} / mo</span>
            </div>

            <div className="space-y-1 pt-3">
              <span className="text-xs text-neutral-500 block">KNOWLEDGE SOURCES</span>
              <span className="text-white block font-mono text-xs">{state.memorySources.length} sources registered</span>
            </div>

            <div className="space-y-1 pt-3">
              <span className="text-xs text-neutral-500 block">SKILL DIRECTORIES</span>
              <span className="text-white block font-mono text-xs">{state.skillFolders.length} directories</span>
            </div>

            <div className="space-y-1 pt-3">
              <span className="text-xs text-neutral-500 block">WORKSPACES</span>
              <span className="text-white block font-mono text-xs">{state.projectFolders.length} roots</span>
            </div>

            <div className="space-y-1 pt-3">
              <span className="text-xs text-neutral-500 block">HOURLY VALUE</span>
              <span className="font-mono text-white text-base">${state.hourlyRate} / hour</span>
            </div>

            <div className="space-y-1 pt-3">
              <span className="text-xs text-neutral-500 block">SAFETY POSTURE</span>
              <Badge variant="success" className="bg-emerald-950 text-emerald-300 border-emerald-800 mt-1 block w-fit">
                {state.privacyMode.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
