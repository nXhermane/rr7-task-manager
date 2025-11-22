import type { Task } from "~/lib/types";

export function getStatusColor(status: Task['status']) {
    const colors = {
        PENDING: 'border-yellow-500/10 hover:border-yellow-500',
        IN_PROGRESS: 'border-purple-500/10 hover:border-purple-500',
        COMPLETED: 'border-green-500/10 hover:border-green-500'
    };
    return colors[status] || 'border-slate-700';
}

