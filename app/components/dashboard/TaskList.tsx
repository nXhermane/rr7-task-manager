import { useInfiniteQuery } from "@tanstack/react-query"
import type { PaginatedData, Task } from "~/lib/types"
import React, { useState } from "react"
import { Task as TaskItem } from "./Task"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export function TaskList() {
    const [page, setPage] = useState(0)
    const fetchTasks = async (page: number) => {
        const res = await fetch(`/api/tasks?page=${page}&perPage=20`)
        return res.json()
    }
    const { data, isPending, } = useInfiniteQuery<PaginatedData<Task>>({
        queryKey: ['tasks'],
        queryFn: ({ pageParam }) => fetchTasks(pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.page >= lastPage.totalPage) return false
            return lastPage.page + 1
        },
        initialPageParam: 1
    })

    const tasks = data?.pages[page]

    return <ScrollArea className=" overflow-scroll mx-auto px-16" style={{
        scrollbarWidth: 'none'
    }}>
        <div className="space-y-4">
            {
                tasks?.data.map(task => {

                    return <React.Fragment key={task.id}>
                        <TaskItem task={task} />
                    </React.Fragment>
                })
            }
        </div>
    </ScrollArea>
}