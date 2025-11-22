import { CheckCircle2, Clock, FileText, Zap } from "lucide-react";
import type { TaskStats } from "~/lib/types";

export function SubTaskStats({ completed, inProgress, pending, total }: TaskStats) {

    return <div className="flex flex-row items-center gap-4">
        <div className="flex-row gap-2 px-3 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <p className="text-lg font-bold" id="total-tasks">{total}</p>
            <FileText className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-row gap-2 px-3 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <p className="text-lg font-bold" id="total-tasks">{pending}</p>
            <Clock className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="flex-row gap-2 px-3 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <p className="text-lg font-bold" id="total-tasks">{inProgress}</p>
            <Zap className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-row gap-2 px-3 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <p className="text-lg font-bold" id="total-tasks">{completed}</p>
            <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
    </div>
}