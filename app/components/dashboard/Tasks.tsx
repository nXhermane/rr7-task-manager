import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { PaginatedData, Task } from "~/lib/types"
import React, { useRef, useState } from "react"
import { Task as TaskItem } from "~/components/dashboard/Task"
import { Button } from "~/components/ui/button"
import { AddTaskModal } from "~/components/dashboard/AddTaskModal"
import { TaskDetail } from "~/components/dashboard/TaskDetail"
import { deleteTask, getPaginatedSubTask, getPaginatedTask } from "~/lib/api"
import { TASK, TASKS, USER_STATS } from "~/lib/query_key"
import { Virtuoso } from 'react-virtuoso'
import { Spinner } from "~/components/ui/spinner"
import { toast } from "sonner"
import { AddSubTaskModal } from "./AddSubTaskModal"
import { CheckCircle2, Plus } from "lucide-react"
import { AnimatePresence, motion } from 'motion/react'

export function Tasks() {
    const queryClient = useQueryClient()
    const [currentTaskId, setCurrentTaskId] = useState<string>()
    const [currentParentId, setCurrentParentId] = useState<string>()
    const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false)
    const historyStack = useRef<string[]>([])
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
        <div className="mx-16 flex-row flex gap-4 justify-between">
            <motion.div
                initial={{
                    width: '100%'
                }}
                animate={{
                    width: currentTaskId ? '30%' : '100%'
                }}
                transition={{
                    duration: 0.7
                }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold">Tâches</h2>
                        <Button onClick={() => {
                            setShowAddTaskModal(true)
                        }} className="p-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold  rounded-lg transition duration-300 ease-in-out hover:scale-110">
                            <Plus className="w-4 h-4" />
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
                                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                    <p className="text-slate-400">Vous n'avez pas de tâche</p>
                                    <Button onClick={() => setShowAddTaskModal(true)} className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition duration-300 ease-in-out hover:scale-110">
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
            </motion.div>
            <AnimatePresence>


                {currentTaskId ?
                    <motion.div
                        exit={{
                            width: '0%',
                            opacity: 0
                        }}
                        initial={{
                            width: '0%'
                        }} animate={
                            {
                                width: '70%'
                            }
                        }
                        transition={{
                            duration: 0.7
                        }}

                        className=" max-h-[61vh]">
                        <TaskDetail taskId={currentTaskId} onClose={async () => {
                            if (currentParentId) {
                                setCurrentTaskId(currentParentId)
                                setCurrentParentId(historyStack.current.pop())
                                // setCurrentParentId(undefined)
                            } else {
                                setCurrentTaskId(undefined)
                            }
                        }} onDelete={() => {
                            deleteTaskMutation.mutate({ taskId: currentTaskId })
                        }} onPressSubTask={async (subTaskId) => {
                            historyStack.current.push(currentTaskId)
                            setCurrentParentId(currentTaskId)
                            setCurrentTaskId(subTaskId)
                        }} />
                    </motion.div> : null
                }
            </AnimatePresence>
        </div>
        {showAddTaskModal && (currentParentId ? <AddSubTaskModal taskId={currentParentId} isVisible={showAddTaskModal} onClose={() => {
            setShowAddTaskModal(false)
            refetch()
        }} /> : <AddTaskModal isVisible={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} />)}

    </React.Fragment>
}

