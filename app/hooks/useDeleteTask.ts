import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useFetcher } from "react-router"
import { toast } from "sonner"

export function useDeleteTask(parentId?: null | string,onSuccess?:() => void ) {
    const fetcher = useFetcher()
    const queryClient = useQueryClient()
    const deleteTask = (taskId: string) => {
        fetcher.submit({}, {
            method: 'DELETE',
            action: `/api/task/${taskId}`
        })
    }
    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            if (fetcher.data?.message) {
                if (parentId != null) queryClient.invalidateQueries({ queryKey: ['subTasks', parentId] })
                else {
                    queryClient.invalidateQueries({ queryKey: ['tasks'] })
                    queryClient.invalidateQueries({ queryKey: ['userStats'] })
                }
                onSuccess && onSuccess()
                toast.success(fetcher.data.message)
            }

        }
    }, [fetcher.data, fetcher.state])
    return { fetcher, deleteTask }
}