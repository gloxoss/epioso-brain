import type { DataTableColumn } from "./ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  EmptyState,
  PageHeader,
} from "./ui";
import type { SectionPageContent } from "../lib/section-content";

interface PreviewRow {
  readonly id: string;
  readonly item: string;
  readonly state: string;
  readonly nextStep: string;
}

const previewColumns: readonly DataTableColumn<PreviewRow>[] = [
  {
    key: "item",
    header: "Item",
  },
  {
    key: "state",
    header: "State",
  },
  {
    key: "nextStep",
    header: "Next step",
  },
];

const previewRows = [] as const satisfies readonly PreviewRow[];

export interface SectionEmptyPageProps {
  readonly content: SectionPageContent;
}

export function SectionEmptyPage({ content }: SectionEmptyPageProps) {
  return (
    <section className="space-y-5">
      <PageHeader
        description={content.description}
        eyebrow={content.eyebrow}
        title={content.title}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription>{content.tableDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState title={content.emptyTitle} description={content.emptyDescription} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next setup work</CardTitle>
            <CardDescription>
              These are the pieces this section expects from later batches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {content.nextSteps.map((step) => (
                <li
                  className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm leading-5 text-neutral-700"
                  key={step}
                >
                  {step}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <DataTable
        caption={content.tableCaption}
        columns={previewColumns}
        description={content.tableDescription}
        emptyState={
          <EmptyState title={content.emptyTitle} description={content.emptyDescription} />
        }
        getRowKey={(row) => row.id}
        rows={previewRows}
      />
    </section>
  );
}
