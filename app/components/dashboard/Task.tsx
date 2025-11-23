import type { Task as TaskDto } from "~/lib/types";
import { Button } from "../ui/button";
import { ChevronRight, Trash2 } from "lucide-react";
import { TaskBadge } from "./TaskBadge";
import { getStatusColor } from "../utils";

export interface TaskProps {
  task: TaskDto;
  isExpand?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
}

export function Task({ task, isExpand = true, onPress, onDelete }: TaskProps) {
  const hasSubtasks = task.totalSubTasks != 0;
  return (
    <div
      onClick={onPress && onPress}
      className={`task-item bg-slate-800/50 backdrop-blur-sm border  rounded-xl  transition duration-300 ${getStatusColor(task.status)} `}
    >
      <div className={isExpand ? "p-5 min-w-0" : "px-3 py-3"}>
        <div className="flex items-start justify-between">
          <div
            className={`flex items-start space-x-4 flex-1 ${isExpand ? "min-w-0" : "min-w-0 flex-col gap-2"}`}
          >
            <div className={`flex-1 ${!isExpand ? "w-full" : "min-w-0"}`}>
              <div
                className={`flex items-center space-x-3 mb-2 ${isExpand ? "" : "w-full justify-between"}`}
              >
                <h3 className={`text-lg font-semibold truncate`}>
                  {task.title}
                </h3>
                {isExpand && <TaskBadge status={task.status} />}
                {hasSubtasks ? (
                  isExpand ? (
                    <span className="text-xs text-slate-400 text-nowrap">
                      ({task.totalSubTasks} sous-tâches)
                    </span>
                  ) : (
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-300">
                      {task.totalSubTasks}
                    </span>
                  )
                ) : (
                  <></>
                )}
              </div>
              {isExpand && task.description?.trim() != "" ? (
                <p className="text-slate-400 text-sm mb-3">
                  {task.description}
                </p>
              ) : (
                ""
              )}

              {isExpand && (
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span>
                    Créée le{" "}
                    {new Date(task.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}
            </div>
            {!isExpand && (
              <div className="items-center flex justify-between w-full">
                <TaskBadge status={task.status} />
                {hasSubtasks && (
                  <button className=" duration-300 ease-in-out hover:scale-110 text-slate-400 hover:text-white transition transform">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {isExpand && (
            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete();
                }}
                className="duration-300 ease-in-out hover:scale-110 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
