import { useInfiniteQuery } from "@tanstack/react-query"
import type { PaginatedData, Task } from "~/lib/types"
import React, { useState } from "react"
import { Task as TaskItem } from "~/components/dashboard/Task"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useParams } from "react-router"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Button } from "~/components/ui/button"
import { AddTaskModal } from "~/components/dashboard/AddTaskModal"
import { TaskDetail } from "~/components/dashboard/TaskDetail"

export default function Tasks() {
    const { taskId } = useParams()
    const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false)
    const [page, setPage] = useState(0)
    const fetchTasks = async (page: number) => {
        const res = await fetch(`/api/tasks?page=${page}&perPage=20`)
        return res.json()
    }
    const fetchSubTasks = async (page: number) => {
        const res = await fetch(`/api/task/${taskId}/tasks?page=${page}&perPage=20`)
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
    console.log(data)
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
                        <div>
                            <ScrollArea className=" overflow-scroll px-5 py-5 max-h-[50vh] " style={{
                                scrollbarWidth: 'none'
                            }}>
                                <div className="space-y-4">
                                    {
                                        tasks?.data.map(task => {

                                            return <React.Fragment key={task.id}>
                                                <TaskItem isExpand={!taskId} task={task} />
                                            </React.Fragment>
                                        })
                                    }
                                    {tasks?.data.length === 0 && <div className="text-center py-12">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-slate-400">Vous n'avez pas de tâche</p>
                                        <Button onClick={() => setShowAddTaskModal(true)} className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition">
                                            Ajouter une tâche
                                        </Button>
                                    </div>}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </ResizablePanel>
                {taskId && <>
                    <ResizableHandle className="w-[0.09px] opacity-45 bg-slate-700 border-0 mx-5" />
                    <ResizablePanel minSize={40} defaultSize={70} className=" max-h-[61vh] transition-all">

                        <TaskDetail taskId={taskId} />

                    </ResizablePanel></>

                }

            </ResizablePanelGroup>
        </div>
        {showAddTaskModal && <AddTaskModal isVisible={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} />}
    </React.Fragment>
}


/**
 * <ResizablePanelGroup direction="horizontal" className="bg-red-500">
        <ResizablePanel defaultSize={30}>
            <div>
                <ScrollArea className=" overflow-scroll " style={{
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
            </div>
        </ResizablePanel>
        {taskId && <>
            <ResizableHandle />

            <ResizablePanel>
                <div>
                    <ScrollArea className=" overflow-scroll mx-auto px-16" style={{
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
                </div>
            </ResizablePanel></>

        }

    </ResizablePanelGroup>
 */