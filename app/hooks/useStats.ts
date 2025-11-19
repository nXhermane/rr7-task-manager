import { useMemo } from "react";
import { useOutletContext } from "react-router";
import type { DashboardContextType } from "~/routes/_layout";

export function useStats () {
    const [_,tasks] = useOutletContext<DashboardContextType>()
    const stats = useMemo(() => ({
        completed: tasks.filter(task => task.status === 'completed').length,
        pending: tasks.filter(task => task.status === 'pending').length,
        progress: tasks.filter(task => task.status === 'progress').length,
        total: tasks.length
    }), [tasks])
    return stats
}