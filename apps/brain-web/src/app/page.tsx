import type { DataTableColumn } from "../components/ui";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  EmptyState,
  ErrorCallout,
  LoadingSkeleton,
  PageHeader,
} from "../components/ui";
import {
  dashboardHeader,
  dashboardMetrics,
  dashboardQueueRows,
  dashboardReviewRows,
  type DashboardQueueRow,
  type DashboardReviewRow,
} from "../lib/dashboard-content";

const reviewColumns: readonly DataTableColumn<DashboardReviewRow>[] = [
  {
    key: "area",
    header: "Area",
  },
  {
    key: "status",
    header: "Status",
  },
  {
    key: "nextStep",
    header: "Next step",
  },
];

const queueColumns: readonly DataTableColumn<DashboardQueueRow>[] = [
  {
    key: "queue",
    header: "Queue",
  },
  {
    key: "state",
    header: "State",
  },
  {
    key: "note",
    header: "Note",
  },
];

const metricToneToBadge = {
  neutral: "neutral",
  success: "success",
  warning: "warning",
  info: "info",
} as const;

export default function DashboardPage() {
  return (
    <section className="space-y-5">
      <PageHeader
        description={dashboardHeader.description}
        eyebrow={dashboardHeader.eyebrow}
        title={dashboardHeader.title}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-neutral-600">{metric.label}</p>
                <Badge variant={metricToneToBadge[metric.tone]}>{metric.badge}</Badge>
              </div>
              <p className="text-3xl font-semibold tracking-normal text-neutral-950">
                {metric.value}
              </p>
              <p className="text-sm leading-5 text-neutral-600">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <DataTable
          caption="Review queue"
          columns={reviewColumns}
          description="Items that need a decision before any write or external action runs."
          emptyState={
            <EmptyState
              title="No work is waiting for review"
              description="After scans and agent imports are connected, staged changes, risky actions, and approval requests will appear here."
            />
          }
          getRowKey={(row) => row.id}
          rows={dashboardReviewRows}
        />

        <Card>
          <CardHeader>
            <CardTitle>First scan readiness</CardTitle>
            <CardDescription>
              Scanner health will appear here once the API section connects the local workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ErrorCallout
              title="Scanner not connected"
              message="The dashboard shell is ready, but the scan API and queue workers are still pending integration."
            />
            <LoadingSkeleton rows={3} title="Waiting for scan data" />
          </CardContent>
        </Card>
      </div>

      <DataTable
        caption="Automation queues"
        columns={queueColumns}
        description="Local jobs will show attempts, state, and the next review step."
        emptyState={
          <EmptyState
            title="No automation jobs have run"
            description="Workspace scans, session imports, and adapter health checks will appear here after the queue is wired."
          />
        }
        getRowKey={(row) => row.id}
        rows={dashboardQueueRows}
      />
    </section>
  );
}
