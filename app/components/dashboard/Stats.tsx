import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, Clock, FileText, Zap } from "lucide-react"
import { useOutletContext } from "react-router"
import { getUserStats } from "~/lib/api"
import { USER_STATS } from "~/lib/query_key"
import type { DashboardContextType } from "~/routes/_layout"


export function Stats() {
  const [user] = useOutletContext<DashboardContextType>()
  const { data } = useQuery({
    queryKey: [USER_STATS, user.id],
    queryFn: getUserStats,
    initialData: {
      userId: '',
      stats: {
        completed: 0,
        inProgress: 0,
        pending: 0,
        total: 0
      }
    }
  })
  return <div className="mx-16 mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Total Tâches</p>
          <p className="text-3xl font-bold mt-2" id="total-tasks">{data.stats.total}</p>
        </div>
        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </div>

    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-yellow-500/50 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">En Attente</p>
          <p className="text-3xl font-bold mt-2 text-yellow-400" id="pending-tasks">{data.stats.pending}</p>
        </div>
        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
          <Clock className="w-6 h-6 text-yellow-400" />
        </div>
      </div>
    </div>

    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">En Cours</p>
          <p className="text-3xl font-bold mt-2 text-purple-400" id="progress-tasks">{data.stats.inProgress}</p>
        </div>
        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Zap className="w-6 h-6 text-purple-400"  />
        </div>
      </div>
    </div>

    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Terminées</p>
          <p className="text-3xl font-bold mt-2 text-green-400" id="completed-tasks">{data.stats.completed}</p>
        </div>
        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
      </div>
    </div>
  </div>

}