import {
  ActionRiskLevel,
  AdapterKind,
  AdapterStatus,
  AgentSource,
  AuditAction,
  AuditActor,
  AuditResult,
  ProjectDocumentKind,
  ProjectStatus,
  PrismaClient,
  RiskLevel,
  TaskPriority,
  TaskStatus,
  TargetAgent,
} from "@prisma/client";

const prisma = new PrismaClient();

const workspaceRoot = "D:/Users/zakio/Desktop/Work/Epioso";

const projects = [
  {
    slug: "epioso-brain",
    name: "EPIOSO Brain",
    path: `${workspaceRoot}/epioso-brain`,
    stack: {
      category: "local control plane",
      tools: ["Nx", "TypeScript", "PostgreSQL", "Redis", "Prisma"],
    },
    status: ProjectStatus.ACTIVE,
    ownerSkill: "epioso-logics",
    riskLevel: RiskLevel.MEDIUM,
  },
  {
    slug: "epioso-com",
    name: "epioso.com",
    path: `${workspaceRoot}/epioso-web`,
    stack: {
      category: "agency website",
      tools: ["Next.js 15", "TypeScript", "Tailwind CSS", "GSAP"],
    },
    status: ProjectStatus.ACTIVE,
    ownerSkill: "epioso-ui",
    riskLevel: RiskLevel.LOW,
  },
  {
    slug: "creative-content-engine",
    name: "Creative Content Engine",
    path: `${workspaceRoot}/external-projects/creative-content-engine`,
    stack: {
      category: "AI product",
      tools: ["FastAPI", "Next.js", "Gemini", "Claude"],
    },
    status: ProjectStatus.ACTIVE,
    ownerSkill: "epioso-ai",
    riskLevel: RiskLevel.MEDIUM,
  },
  {
    slug: "medicore-his",
    name: "MediCore HIS",
    path: `${workspaceRoot}/external-projects/medicore-his`,
    stack: {
      category: "healthcare technology",
      tools: ["Next.js", "NestJS", "FastAPI", "PostgreSQL"],
    },
    status: ProjectStatus.ACTIVE,
    ownerSkill: "epioso-logics",
    riskLevel: RiskLevel.HIGH,
  },
  {
    slug: "vetaprof",
    name: "VetaProf",
    path: `${workspaceRoot}/external-projects/vetaprof`,
    stack: {
      category: "medical workwear commerce",
      tools: ["WordPress", "WooCommerce", "Tailwind CSS", "GSAP"],
    },
    status: ProjectStatus.LIVE,
    ownerSkill: "vetaprof-dev",
    riskLevel: RiskLevel.MEDIUM,
  },
  {
    slug: "zdream-f",
    name: "ZDream-f",
    path: `${workspaceRoot}/external-projects/zdream-f`,
    stack: {
      category: "fashion brand platform",
      tools: ["Next.js"],
    },
    status: ProjectStatus.LIVE,
    ownerSkill: "epioso-ui",
    riskLevel: RiskLevel.LOW,
  },
  {
    slug: "of-app",
    name: "OF App",
    path: `${workspaceRoot}/external-projects/of-app`,
    stack: {
      category: "mobile web app",
      tools: ["Next.js", "NestJS", "PostgreSQL"],
    },
    status: ProjectStatus.ACTIVE,
    ownerSkill: "epioso-logics",
    riskLevel: RiskLevel.MEDIUM,
  },
  {
    slug: "epioso-ai-team",
    name: "EPIOSO AI Team",
    path: `${workspaceRoot}/hermes-mcp-bridges`,
    stack: {
      category: "agency AI agents",
      tools: ["Paperclip", "n8n", "Gemini"],
    },
    status: ProjectStatus.ACTIVE,
    ownerSkill: "epioso-ai",
    riskLevel: RiskLevel.MEDIUM,
  },
  {
    slug: "lango-english",
    name: "Lango English",
    path: `${workspaceRoot}/external-projects/lango-english`,
    stack: {
      category: "English school content pipeline",
      tools: ["Gemini", "Veo 3.1", "n8n"],
    },
    status: ProjectStatus.ACTIVE,
    ownerSkill: "epioso-content",
    riskLevel: RiskLevel.MEDIUM,
  },
] as const;

const adapters = [
  {
    key: "local-filesystem",
    name: "Local Filesystem Scanner",
    kind: AdapterKind.LOCAL_SERVICE,
    status: AdapterStatus.DISABLED,
    baseUrl: null,
    capabilities: ["scan.workspace", "scan.project", "scan.docs"],
  },
  {
    key: "cloud-hermes",
    name: "Hermes Cloud Bridge",
    kind: AdapterKind.CLOUD_BRIDGE,
    status: AdapterStatus.DISABLED,
    baseUrl: "http://127.0.0.1:9119",
    capabilities: ["hermes.status", "hermes.sessions"],
  },
  {
    key: "n8n-local",
    name: "n8n Local Automation",
    kind: AdapterKind.AUTOMATION,
    status: AdapterStatus.DISABLED,
    baseUrl: "http://127.0.0.1:5678",
    capabilities: ["n8n.workflows", "n8n.executions"],
  },
  {
    key: "github-local",
    name: "GitHub Local Adapter",
    kind: AdapterKind.REPOSITORY,
    status: AdapterStatus.DISABLED,
    baseUrl: null,
    capabilities: ["git.status", "github.repository.read"],
  },
] as const;

async function seedProjects(): Promise<void> {
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        name: project.name,
        path: project.path,
        stack: project.stack,
        status: project.status,
        ownerSkill: project.ownerSkill,
        riskLevel: project.riskLevel,
      },
      create: project,
    });
  }
}

async function seedAdapters(): Promise<void> {
  for (const adapter of adapters) {
    await prisma.adapter.upsert({
      where: { key: adapter.key },
      update: {
        name: adapter.name,
        kind: adapter.kind,
        status: adapter.status,
        baseUrl: adapter.baseUrl,
        capabilities: adapter.capabilities,
      },
      create: adapter,
    });
  }
}

async function seedBrainDocuments(projectId: string): Promise<void> {
  const documents = [
    {
      kind: ProjectDocumentKind.AGENTS,
      title: "EPIOSO Agent Context",
      path: `${workspaceRoot}/AGENTS.md`,
      summary: "Workspace agent rules, active project context, and safety boundaries.",
    },
    {
      kind: ProjectDocumentKind.PLAN,
      title: "UltraPlan Technical Plan",
      path: `${workspaceRoot}/.ultraplan/PLAN.md`,
      summary: "Technical plan for the EPIOSO Brain local control plane.",
    },
    {
      kind: ProjectDocumentKind.SPEC,
      title: "Data Model",
      path: `${workspaceRoot}/pre-dev/05-data-model.md`,
      summary: "MVP data model for projects, scans, Git status, sessions, tasks, and audit events.",
    },
  ] as const;

  for (const document of documents) {
    await prisma.projectDocument.upsert({
      where: {
        projectId_path: {
          projectId,
          path: document.path,
        },
      },
      update: {
        kind: document.kind,
        title: document.title,
        summary: document.summary,
      },
      create: {
        projectId,
        kind: document.kind,
        title: document.title,
        path: document.path,
        summary: document.summary,
      },
    });
  }
}

async function seedSectionTask(projectId: string): Promise<void> {
  const existingTask = await prisma.task.findFirst({
    where: {
      projectId,
      title: "Review Section 04 database foundation",
    },
  });

  const task =
    existingTask ??
    (await prisma.task.create({
      data: {
        projectId,
        title: "Review Section 04 database foundation",
        objective:
          "Confirm Prisma schema, local Docker data services, and seed data before downstream API modules depend on them.",
        targetAgent: TargetAgent.CODEX,
        status: TaskStatus.DRAFT,
        priority: TaskPriority.P1,
        riskLevel: RiskLevel.MEDIUM,
      },
    }));

  const existingAuditEvent = await prisma.auditEvent.findFirst({
    where: {
      taskId: task.id,
      action: AuditAction.SEED,
      result: AuditResult.SUCCESS,
    },
  });

  if (existingAuditEvent === null) {
    await prisma.auditEvent.create({
      data: {
        actor: AuditActor.SYSTEM,
        taskId: task.id,
        projectId,
        action: AuditAction.SEED,
        riskLevel: ActionRiskLevel.READ,
        result: AuditResult.SUCCESS,
        metadata: {
          source: "prisma/seed.ts",
          writesExternalSystems: false,
        },
      },
    });
  }
}

async function seedStarterSession(projectId: string): Promise<void> {
  const existingSession = await prisma.agentSession.findFirst({
    where: {
      projectId,
      source: AgentSource.CODEX,
      title: "Batch 02 Section 04 database foundation",
    },
  });

  if (existingSession === null) {
    await prisma.agentSession.create({
      data: {
        projectId,
        source: AgentSource.CODEX,
        title: "Batch 02 Section 04 database foundation",
        summary:
          "Initial local Postgres, Redis, Prisma schema, and seed setup for the Brain control plane.",
      },
    });
  }
}

async function main(): Promise<void> {
  await seedProjects();
  await seedAdapters();

  const brainProject = await prisma.project.findUniqueOrThrow({
    where: { slug: "epioso-brain" },
  });

  await seedBrainDocuments(brainProject.id);
  await seedSectionTask(brainProject.id);
  await seedStarterSession(brainProject.id);
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
