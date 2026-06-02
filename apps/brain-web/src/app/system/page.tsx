import type { DataTableColumn } from "../../components/ui";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmActionDialog,
  DataTable,
  EmptyState,
  ErrorCallout,
  LoadingSkeleton,
  PageHeader,
} from "../../components/ui";

interface SystemCheckRow {
  readonly id: string;
  readonly check: string;
  readonly state: string;
  readonly note: string;
}

const systemCheckColumns: readonly DataTableColumn<SystemCheckRow>[] = [
  {
    key: "check",
    header: "Check",
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

const systemCheckRows = [
  {
    id: "local-only",
    check: "Local-only mode",
    state: "On",
    note: "The Brain is planned for this workstation, not public hosting.",
  },
  {
    id: "approval-gate",
    check: "Approval gate",
    state: "Required",
    note: "Write actions should be staged until you approve them.",
  },
  {
    id: "scan-api",
    check: "Scanner API",
    state: "Pending",
    note: "Later API sections will connect workspace scans and health checks.",
  },
] as const satisfies readonly SystemCheckRow[];

export default function SystemPage() {
  return (
    <section className="space-y-5">
      <PageHeader
        description="Local health, safety checks, and integration status for the private Brain dashboard."
        eyebrow="System"
        title="System"
        actions={
          <>
            <Badge variant="private">Private</Badge>
            <Badge variant="warning">API pending</Badge>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <DataTable
          caption="System checks"
          columns={systemCheckColumns}
          description="Readiness checks for the local control plane."
          getRowKey={(row) => row.id}
          rows={systemCheckRows}
        />

        <Card>
          <CardHeader>
            <CardTitle>Review controls</CardTitle>
            <CardDescription>
              Actions that can affect local state stay behind confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Run check</Button>
              <Button variant="secondary">Export report</Button>
              <Button variant="subtle">Dismiss</Button>
            </div>
            <ConfirmActionDialog
              confirmLabel="Keep staged"
              description="This action is a shell-only confirmation until the audit service is connected."
              title="Keep this action staged?"
              triggerLabel="Review staged action"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Health feed</CardTitle>
            <CardDescription>
              Recent system events will appear after health polling is wired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No health events have been recorded"
              description="Adapter checks, queue failures, scan completions, and approval events will appear here with clear timestamps."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending integration</CardTitle>
            <CardDescription>
              Shell pieces are ready while the API and scanner are still being built.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ErrorCallout
              title="Live system data is not connected"
              message="This page is using static readiness rows until the API contracts and local workers are added."
            />
            <LoadingSkeleton rows={4} title="Waiting for live system data" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
