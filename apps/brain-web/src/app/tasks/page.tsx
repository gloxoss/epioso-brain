import { SectionEmptyPage } from "../../components/section-empty-page";
import { sectionPages } from "../../lib/section-content";

export default function TasksPage() {
  return <SectionEmptyPage content={sectionPages.tasks} />;
}
