import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { type TaskStats, type PaginatedData, type Task } from "~/lib/types"
import { SubTaskStats, TaskBadge } from "./Task"
import { Task as TaskItem } from "./Task"
import { useState } from "react"
import { AddSubTaskModal } from "./AddSubTaskModal"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { useDeleteTask } from "~/hooks/useDeleteTask"
import { useNavigate } from "react-router"
import { Input } from "../ui/input"
import { useUpdateTask } from "~/hooks/useUpdateTask"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "../ui/select"
import { Trash2, X } from "lucide-react"
export interface TaskDetailProps {
    taskId: string
}
export function TaskDetail({ taskId }: TaskDetailProps) {
    const [page, setPage] = useState(0)
    const queryClient = useQueryClient()
    const [showAddSubTaskModal, setShowAddSubTaskModal] = useState<boolean>(false);
    const [showDescriptionAddBtn, setShowDescriptionAddBtn] = useState<boolean>(false)
    const [showAddDescritpionInput, setShowAddDescriptionInput] = useState<boolean>(false)
    const [editTitle, setEditTitle] = useState<boolean>(false)
    const navigate = useNavigate()
    const { deleteTask } = useDeleteTask(null, () => {
        navigate('/')
    })
    const { updateTask } = useUpdateTask(() => {
        queryClient.invalidateQueries({ queryKey: ['userStats'] })
    })
    const { data, isPending } = useQuery<Task>({
        queryKey: ['task', taskId],
        queryFn: async () => {
            const response = await fetch('/api/task/' + taskId)
            return (await response.json()).task
        }
    })
    const fetchSubTasks = async (page: number) => {
        const res = await fetch(`/api/task/${taskId}/tasks?page=${page}&perPage=20`)
        return res.json()
    }
    const fetchSubTaskStats = async ( ) => {
        const res = await fetch(`/api/task/${taskId}/stats`)
        return (await res.json()).stats
    }

    const { data: subTasks, } = useInfiniteQuery<PaginatedData<Task>>({
        queryKey: ['subTasks', taskId],
        queryFn: ({ pageParam }) => fetchSubTasks(pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.page >= lastPage.totalPage) return false
            setPage(lastPage.page - 1)
            return lastPage.page + 1
        },
        initialPageParam: 1
    })
    const {data:taskStats} = useQuery<TaskStats>({
        queryKey: ['taskStats',taskId],
        queryFn: fetchSubTaskStats
    })

    const hasSubtasks = data?.totalSubTasks != 0
    const hasDescription = data?.description?.trim() !== ''
    if (isPending) {
        return <div className="flex items-center justify-center h-full text-slate-400">
            <Spinner />
        </div>
    }
    if (!data) {
        return <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-xl">Sélectionnez une tâche pour voir les détails</p>
            </div>
        </div>
    }
    return <> <div className=" w-full h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex flex-col overflow-hidden">
        <div className="h-full flex flex-col slide-in-right">
            <div onMouseEnter={() => {
                if (!hasDescription) {
                    setShowDescriptionAddBtn(true)
                }
            }} onMouseLeave={() => {
                if (!hasDescription) {
                    setShowDescriptionAddBtn(false)
                }
            }} className="relative p-6 border-b border-slate-700">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        {!editTitle && <h2 onDoubleClick={() => {
                            setEditTitle(true)
                        }} className="text-2xl font-bold mb-2">{data?.title}</h2>}
                        {editTitle && <div>
                            <Input defaultValue={data.title} onBlur={(e) => {
                                if (e.target.value?.trim().length >= 3) {
                                    updateTask(taskId, {
                                        title: e.target.value.trim()
                                    })
                                }
                                setEditTitle(false)
                            }} id="task-title" className="w-full h-12 px-4 py-3  border-none rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Entrer le titre de la tâche" />
                        </div>}

                        <TaskBadge status={data?.status || "IN_PROGRESS"} />
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => {
                            deleteTask(taskId)
                        }} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition" title="Supprimer">
                            <Trash2 className="h-5 w-5" />
                        </button>
                         <button onClick={() => {
                            navigate(-1)
                        }} className="p-2 text-gray-50 hover:bg-gray-500/20 rounded-lg transition" title="Close">
                           <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="text-sm text-slate-400 space-y-1">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Créée le {new Date(data?.createdAt || '').toLocaleDateString('fr-FR')}</span>
                    </div>

                </div>
                {showDescriptionAddBtn && <Button onClick={() => {
                    setShowAddDescriptionInput(true)
                }} className="absolute -bottom-6 left-1/2 -translate-x-1/2 border-none px-6 py-3 min-h-12 text-white bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter une description</span>
                </Button>}
            </div>
            <div className="flex-1 overflow-y-auto p-6 max-h-fit" style={{
                scrollbarWidth: 'none'
            }}>
                {(hasDescription || showAddDescritpionInput) ?
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            Description
                        </h3>
                        {!showAddDescritpionInput && <p onDoubleClick={() => {
                            setShowAddDescriptionInput(true)
                        }} className="text-slate-300 leading-relaxed">{data?.description}</p>}
                        {showAddDescritpionInput && <div><Input defaultValue={data.title} onBlur={(e) => {
                            if (e.target.value?.trim().length >= 3) {
                                updateTask(taskId, {
                                    description: e.target.value.trim()
                                })
                            }
                            setShowAddDescriptionInput(false)
                        }} className="w-full h-12 px-4 py-3  border-none rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Entrer le titre de la tâche" />
                        </div>}
                    </div>
                    : ''}


                {hasSubtasks ?
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <SubTaskStats total={0} completed={0} inProgress={0} pending={0} {...taskStats} />
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {subTasks?.pages[0].data.map(subtask => <TaskItem key={subtask.id} task={subtask} />)}
                        </div>
                    </div>
                    :
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-slate-400">Cette tâche n'a pas de sous-tâches</p>
                        <Button onClick={() => setShowAddSubTaskModal(true)} className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition">
                            Ajouter une sous-tâche
                        </Button>
                    </div>}

            </div>
            <div className="p-6 border-t border-slate-700">
                <div className="flex space-x-3">
                    <Button onClick={() => setShowAddSubTaskModal(true)} className="flex-1 h-12 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Ajouter une sous-tâche</span>
                    </Button>
                    <Select defaultValue={data.status} onValueChange={(value) => {
                        updateTask(taskId, {
                            status: value as any
                        })

                    }} >
                        <SelectTrigger withIcon={false} className=" border-none px-6 py-3 min-h-12 text-white bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition">
                            <button className="text-white">
                                Changer statut
                            </button>
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
        {showAddSubTaskModal && <AddSubTaskModal isVisible={showAddSubTaskModal} onClose={() => setShowAddSubTaskModal(false)} taskId={taskId} taskTitle={data?.title || ""} />}
    </>
}