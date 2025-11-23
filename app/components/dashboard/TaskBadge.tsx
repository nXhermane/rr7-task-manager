import type { Task } from "~/lib/types";

export function TaskBadge(props: { status: Task["status"] }) {
  switch (props.status) {
    case "PENDING":
      return (
        <span className="px-3 py-1  text-nowrap bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
          En attente
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="px-3 py-1 text-nowrap bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full">
          En cours
        </span>
      );
    case "COMPLETED":
      return (
        <span className="px-3 py-1 text-nowrap bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
          Terminée
        </span>
      );
    default:
      return <></>;
  }
}
