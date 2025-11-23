import { useInfiniteQuery, useMutation, useQueries, useQueryClient } from "@tanstack/react-query"
import { type PaginatedData, type Task, type UpdateTaskDto } from "~/lib/types"
import { Task as TaskItem } from "./Task"
import { useEffect, useState } from "react"
import { AddSubTaskModal } from "./AddSubTaskModal"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "../ui/select"
import { LucideAlignLeft, Plus, Trash2, X } from "lucide-react"
import { SUB_TASKS, TASK, TASK_STATS, TASKS, USER_STATS } from "~/lib/query_key"
import { deleteTask, getPaginatedSubTask, getTask, getTaskStats, updateTask } from "~/lib/api"
import { Virtuoso } from "react-virtuoso"
import { toast } from "sonner"
import { SubTaskStats } from "./SubTaskStats"
import { getStatusColor } from "../utils"
export interface TaskDetailProps {
    taskId: string
    onClose?: () => void
    onPressSubTask?: (subTaskId: string) => void
    onDelete?: () => void
}
export function TaskDetail({ taskId, onClose, onPressSubTask, onDelete }: TaskDetailProps) {
    const queryClient = useQueryClient()
    const [showAddSubTaskModal, setShowAddSubTaskModal] = useState<boolean>(false);
    const [showDescriptionAddBtn, setShowDescriptionAddBtn] = useState<boolean>(false)
    const [showAddDescritpionInput, setShowAddDescriptionInput] = useState<boolean>(false)
    const [editTitle, setEditTitle] = useState<boolean>(false)
    const deleteMutation = useMutation({
        mutationKey: [TASK, 'delete', taskId],
        mutationFn: ({ taskId: subTaskId }: { taskId: string }) => deleteTask(subTaskId),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: [SUB_TASKS, taskId] })
            queryClient.invalidateQueries({ queryKey: [TASK_STATS, taskId] })

            toast.success('Task deleted successfully')
        },
        onError: async (err, { }, context) => {
            toast.error("Task deleting failed")
        }
    })
    const updateMutation = useMutation({
        mutationKey: [TASK, 'update', taskId],
        mutationFn: ({ taskId, dto }: { taskId: string, dto: UpdateTaskDto }) => updateTask(taskId, dto),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: [TASK, taskId] })
            queryClient.invalidateQueries({ queryKey: [USER_STATS] })
            queryClient.invalidateQueries({ queryKey: [TASKS] })
            toast.success('Task updated successfully')
        },
        onError: (e, { dto }) => {
            console.error(e)
            toast.error("Failed to update task")
        }
    })
    const [taskResult, taskStatsResult] = useQueries({
        queries: [
            {
                queryKey: [TASK, taskId],
                queryFn: () => getTask(taskId)
            }, {
                queryKey: [TASK_STATS, taskId],
                queryFn: () => getTaskStats(taskId),
                initialData: {
                    stats: {
                        completed: 0,
                        inProgress: 0,
                        pending: 0,
                        total: 0
                    },
                    taskId: ''
                }
            }
        ]
    })


    const { data: subTasks, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<PaginatedData<Task>>({
        queryKey: [SUB_TASKS, taskId],
        queryFn: ({ pageParam }) => getPaginatedSubTask(taskId, pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.page >= lastPage.totalPage) return undefined
            return lastPage.page + 1
        },
        initialPageParam: 1,
        initialData: {
            pageParams: [],
            pages: []
        }
    })

    const task = taskResult.data?.task
    const taskStats = taskStatsResult.data


    const flat = subTasks.pages.flatMap(p => p.data)
    useEffect(() => {
        setShowAddDescriptionInput(false)
        setShowDescriptionAddBtn(false)
        setShowAddSubTaskModal(false)
    }, [taskId])
    if (taskResult.isPending) {
        return <div className="w-full h-full  items-center justify-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex flex-col overflow-hidden text-slate-400">
            <Spinner />
        </div>
    }
    if (!task) {
        return <div className="w-full h-full items-center justify-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex flex-col overflow-hidden text-slate-400">
            <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-xl">Sélectionnez une tâche pour voir les détails</p>
            </div>
        </div>
    }
    const hasSubtasks = flat.length > 0
    const hasDescription = typeof task.description === 'string' ? task.description.trim() !== '' : !!task?.description
    return <> <div className=" w-full h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex flex-col overflow-hidden">
        <div className="h-full flex flex-col slide-in-right ">
            <div onMouseEnter={() => {
                if (!hasDescription) {
                    setShowDescriptionAddBtn(true)
                }
            }} onMouseLeave={() => {
                if (!hasDescription) {
                    setShowDescriptionAddBtn(false)
                }
            }} className="relative p-6 border-b border-slate-700">
                <div className={`flex items-start justify-between `}>
                    <div className="flex-1">
                        <h2
                            onBlur={(e) => {
                                updateMutation.mutate({
                                    taskId, dto: { title: e.currentTarget.textContent }
                                })
                                setEditTitle(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.currentTarget.blur()
                                }
                            }}
                            onDoubleClick={() => {
                                setEditTitle(true)
                            }} className={`text-2xl font-bold break-all ${editTitle && "border-slate-700/40 border p-1 rounded-lg"} `} contentEditable={editTitle} suppressContentEditableWarning>{task.title}</h2>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={() => {
                            onDelete && onDelete()
                        }} className="duration-300 ease-in-out hover:scale-110 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition" title="Supprimer">
                            <Trash2 className="h-5 w-5" />
                        </Button>
                        <Button onClick={onClose} className=" duration-300 ease-in-out hover:scale-110 p-2 text-gray-50 hover:bg-gray-500/20 rounded-lg transition" title="Close">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                {showDescriptionAddBtn && <Button onClick={() => {
                    setShowAddDescriptionInput(true)
                }} className="duration-300 ease-in-out hover:scale-110 absolute -bottom-6 left-1/2 -translate-x-1/2 border-none px-6 py-3 min-h-12 text-white bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition">
                    <Plus className="w-7 h-7" />
                    <span>Ajouter une description</span>
                </Button>}
            </div>
            <div className="flex-1  p-6 ">
                <Virtuoso
                    endReached={() => {
                        if (hasNextPage) {
                            fetchNextPage()
                        }
                    }}
                    style={{
                        scrollbarWidth: 'none'
                    }}
                    data={flat}
                    components={{
                        Header: () => {
                            return <> {(hasDescription || showAddDescritpionInput) &&
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <LucideAlignLeft className="w-5 h-5 mr-2" />
                                        Description
                                    </h3>
                                    <p onBlur={(e) => {
                                        updateMutation.mutate({
                                            taskId, dto: {
                                                description: e.currentTarget.textContent
                                            }
                                        })
                                        setShowAddDescriptionInput(false)
                                    }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.currentTarget.blur()
                                            }
                                        }}
                                        onDoubleClick={() => {
                                            setShowAddDescriptionInput(true)
                                        }} className={`text-slate-300 leading-relaxed ${showAddDescritpionInput && "border-slate-700/40 border p-1 rounded-lg"}`} contentEditable={showAddDescritpionInput} suppressContentEditableWarning >{task.description}</p>

                                </div>}

                                {hasSubtasks && <div className="flex items-center justify-between mb-4">
                                    <SubTaskStats {...taskStats.stats} />
                                </div>}</>
                        },
                        EmptyPlaceholder: () => {
                            return <div className="text-center py-12">
                                <Plus className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                <p className="text-slate-400">Cette tâche n'a pas de sous-tâches</p>
                                <Button onClick={() => setShowAddSubTaskModal(true)} className="duration-300 ease-in-out hover:scale-110mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition">
                                    Ajouter une sous-tâche
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
                        <TaskItem task={item} onPress={() => onPressSubTask && onPressSubTask(item.id)} onDelete={() => {
                            deleteMutation.mutate({ taskId: item.id })
                        }} />
                    </div>}


                />




            </div>
            <div className="p-6 border-t border-slate-700">
                <div className="flex space-x-3">
                    <Button onClick={() => setShowAddSubTaskModal(true)} className="duration-300 ease-in-out hover:scale-101 flex-1 h-12 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition">
                        <Plus className="w-5 h-5" />
                        <span>Ajouter une sous-tâche</span>
                    </Button>
                    <Select defaultValue={task.status} onValueChange={(value) => {
                        updateMutation.mutate({
                            taskId, dto: {
                                status: value as any
                            }
                        })
                    }} >
                        <SelectTrigger withIcon={false} className={` duration-300 ease-in-out hover:scale-101 px-6 py-3 min-h-12 text-white   rounded-lg font-semibold transition ${getStatusColor(task.status)}`}>

                            {task.status === 'COMPLETED' ? "Terminée" : task.status === "PENDING" ? "En attente" : "En cours"}

                        </SelectTrigger>
                        <SelectContent className="bg-slate-600 border-none">
                            <SelectGroup>
                                <SelectItem className="text-white font-semibold" value={'PENDING'}>
                                    En attente
                                </SelectItem>
                                <SelectItem className="text-white font-semibold" value={'IN_PROGRESS'}>
                                    En cours
                                </SelectItem>
                                <SelectItem className="text-white font-semibold " value={'COMPLETED'}>
                                    Terminée
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
            </div>
        </div>

    </div>
        {showAddSubTaskModal && <AddSubTaskModal isVisible={showAddSubTaskModal} onClose={() => setShowAddSubTaskModal(false)} taskId={taskId} />}
    </>
}