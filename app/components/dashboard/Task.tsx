import type { Task as TaskDto, TaskStats } from "~/lib/types"
import { Button } from "../ui/button"

export interface TaskProps {
    task: TaskDto
    isExpand?: boolean
    onPress?: () => void
    onDelete?: () => void
}

export function Task({ task, isExpand = true, onPress, onDelete }: TaskProps) {
    const hasSubtasks = task.totalSubTasks != 0
    return <div onClick={onPress && onPress} className={`task-item bg-slate-800/50 backdrop-blur-sm border  rounded-xl  transition duration-300 ${getStatusColor(task.status)} `} >
        <div className={isExpand ? 'p-5 min-w-0' : "px-3 py-3"}>
            <div className="flex items-start justify-between">
                <div className={`flex items-start space-x-4 flex-1 ${isExpand ? "min-w-0" : "min-w-0 flex-col gap-2"}`}>
                    <div className={`flex-1 ${!isExpand ? "w-full" : "min-w-0"}`}>
                        <div className={`flex items-center space-x-3 mb-2 ${isExpand ? "" : "w-full justify-between"}`}>
                            <h3 className={`text-lg font-semibold truncate`} >{task.title}</h3>
                            {isExpand && <TaskBadge status={task.status} />}
                            {hasSubtasks ? isExpand ? <span className="text-xs text-slate-400 text-nowrap">({task.totalSubTasks} sous-tâches)</span> : <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-300">{task.totalSubTasks}</span> : <></>}
                        </div>
                        {(isExpand && task.description?.trim() != '') ? <p className="text-slate-400 text-sm mb-3">{task.description}</p> : ''}

                        {isExpand && <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>Créée le {new Date(task.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>}
                    </div>
                    {!isExpand && <div className="items-center flex justify-between w-full">
                        <TaskBadge status={task.status} />
                        {hasSubtasks &&
                            <button className=" text-slate-400 hover:text-white transition transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>}
                    </div>}
                </div>

                {isExpand && <div className="flex items-center space-x-2 ml-4">
                    <Button onClick={(e) => {
                        e.stopPropagation()
                        onDelete && onDelete()
                    }} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition" title="Supprimer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </Button>
                </div>}
            </div>
        </div>
    </div>
}

export function TaskBadge(props: { status: TaskDto['status'] }) {
    switch (props.status) {
        case "PENDING": return <span className="px-3 py-1  text-nowrap bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">En attente</span>
        case "IN_PROGRESS": return <span className="px-3 py-1 text-nowrap bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full">En cours</span>
        case "COMPLETED": return <span className="px-3 py-1 text-nowrap bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">Terminée</span>
        default: return <></>
    }
}
export function getStatusColor(status: TaskDto['status']) {
    const colors = {
        PENDING: 'border-yellow-500/10 hover:border-yellow-500',
        IN_PROGRESS: 'border-purple-500/10 hover:border-purple-500',
        COMPLETED: 'border-green-500/10 hover:border-green-500'
    };
    return colors[status] || 'border-slate-700';
}

export function SubTaskStats({ completed, inProgress, pending, total }: TaskStats) {

    return <div className="flex flex-row items-center gap-4">
        <div className="flex-row gap-2 px-3 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <p className="text-lg font-bold" id="total-tasks">{total}</p>
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>




        <div className="flex-row gap-2 px-3 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <p className="text-lg font-bold" id="total-tasks">{pending}</p>
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>


        <div className="flex-row gap-2 px-3 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <p className="text-lg font-bold" id="total-tasks">{inProgress}</p>
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        </div>

        <div className="flex-row gap-2 px-3 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <p className="text-lg font-bold" id="total-tasks">{completed}</p>
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

        </div>
    </div>
}