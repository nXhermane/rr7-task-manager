import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { PaginatedData, Task } from "~/lib/types"
import React, { useState } from "react"
import { Task as TaskItem } from "~/components/dashboard/Task"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Button } from "~/components/ui/button"
import { AddTaskModal } from "~/components/dashboard/AddTaskModal"
import { TaskDetail } from "~/components/dashboard/TaskDetail"
import { deleteTask, getPaginatedSubTask, getPaginatedTask } from "~/lib/api"
import { TASK, TASKS, USER_STATS } from "~/lib/query_key"
import { Virtuoso } from 'react-virtuoso'
import { Spinner } from "~/components/ui/spinner"
import { toast } from "sonner"
import { AddSubTaskModal } from "./AddSubTaskModal"

export function Tasks() {
    const queryClient = useQueryClient()
    const [currentTaskId, setCurrentTaskId] = useState<string>()
    const [currentParentId, setCurrentParentId] = useState<string>()
    const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false)

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery<PaginatedData<Task>>({
        queryKey: [TASKS, currentParentId],
        queryFn: ({ pageParam }) => currentParentId ? getPaginatedSubTask(currentParentId, pageParam as number) : getPaginatedTask(pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.page >= lastPage.totalPage) return undefined
            return lastPage.page + 1
        },
        initialPageParam: 1,
        initialData: {
            pageParams: [],
            pages: []
        },
    })
    const deleteTaskMutation = useMutation({
        mutationKey: [TASK],
        mutationFn: ({ taskId }: { taskId: string }) => deleteTask(taskId),
        onSuccess: () => {
            setCurrentTaskId(currentParentId)
            setCurrentParentId(undefined)
            queryClient.invalidateQueries({ queryKey: [TASKS] })
            queryClient.invalidateQueries({ queryKey: [USER_STATS] })
            toast.success("Task deleted successfully")
        },
        onError: (e) => {
            console.error(e)
            toast.error("Failed to delete task")
        }
    })
    const flat = data.pages.flatMap(page => page.data)
    return <React.Fragment>
        <div className="mx-16">
            <ResizablePanelGroup direction="horizontal" className="">
                <ResizablePanel defaultSize={30} minSize={25} className="transition-all duration-300">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex flex-col overflow-hidden transition-all duration-300">
                        <div className="p-4 border-b border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold">Tâches</h2>
                                <Button onClick={() => {
                                    setShowAddTaskModal(true)
                                }} className="p-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold transition0 rounded-lg transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </Button>
                            </div>

                        </div>
                        <div className="w-full px-5 py-5 h-[50vh] ">
                            <Virtuoso style={{
                                scrollbarWidth: 'none'
                            }}
                                endReached={() => {
                                    if (hasNextPage) {
                                        fetchNextPage()
                                    }
                                }}
                                data={flat}
                                components={{
                                    EmptyPlaceholder: () => {
                                        return <div className="text-center py-12">
                                            <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-slate-400">Vous n'avez pas de tâche</p>
                                            <Button onClick={() => setShowAddTaskModal(true)} className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition">
                                                Ajouter une tâche
                                            </Button>
                                        </div>
                                    }
                                    ,
                                    Footer: () => {
                                        if (isFetchingNextPage) {
                                            return <div className="items-center justify-center flex"><Spinner /></div>
                                        }
                                    }
                                }}
                                itemContent={(_, item) => <div className="py-2">
                                    <TaskItem isExpand={!currentTaskId} task={item} onPress={() => setCurrentTaskId(item.id)} onDelete={() => {
                                        deleteTaskMutation.mutate({ taskId: item.id })
                                    }} />
                                </div>}


                            />
                        </div>
                    </div>
                </ResizablePanel>
                {currentTaskId && <>
                    <ResizableHandle className="w-[0.09px] opacity-45 bg-slate-700 border-0 mx-5" />
                    <ResizablePanel minSize={40} defaultSize={70} className=" max-h-[61vh] transition-all">
                        <TaskDetail taskId={currentTaskId} onClose={async () => {
                            if (currentParentId) {
                                setCurrentTaskId(currentParentId)
                                setCurrentParentId(undefined)
                            } else {
                                setCurrentTaskId(undefined)
                            }
                        }} onDelete={() => {
                            deleteTaskMutation.mutate({ taskId: currentTaskId })
                        }} onPressSubTask={async (subTaskId) => {
                            setCurrentParentId(currentTaskId)
                            setCurrentTaskId(subTaskId)
                        }} />
                    </ResizablePanel></>
                }

            </ResizablePanelGroup>
        </div>
        {showAddTaskModal && (currentParentId ? <AddSubTaskModal taskId={currentParentId} isVisible={showAddTaskModal} onClose={() => {
            setShowAddTaskModal(false)
            refetch()
        }} /> : <AddTaskModal isVisible={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} />)}

    </React.Fragment>
}

