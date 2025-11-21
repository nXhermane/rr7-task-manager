import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useFetcher } from "react-router"
import { toast } from "sonner"
import type { Task, UpdateTaskDto } from "~/lib/types"

export function useUpdateTask(onSuccess?: (task: Task) => void) {
    const fetcher = useFetcher()
    const queryClient = useQueryClient()
    const updateTask = (taskId: string, dto: UpdateTaskDto) => {
        fetcher.submit(dto, {
            method: 'PUT',
            action: `/api/task/${taskId}`
        })
    }
    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            if (fetcher.data?.message) {
                queryClient.invalidateQueries({ queryKey: ['task'] })
                onSuccess && onSuccess(fetcher.data.task)
                toast.success(fetcher.data.message)
            }

        }
    }, [fetcher.data, fetcher.state])
    return { fetcher, updateTask }
}