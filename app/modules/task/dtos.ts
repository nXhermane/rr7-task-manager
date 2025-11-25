import z from "zod";
import { createTaskInput, paginationInput, updateTaskInput } from "~/lib/schema";
import { TastkStatus } from "~/shared/generated/prisma/enums";

export const TaskOutput = z.object({
    id: z.uuid(),
    title: z.string().nonempty(),
    description: z.string().nullable(),
    parentId: z.uuid().nullable(),
    status: z.enum(Object.values(TastkStatus)),
    createdAt: z.date(),
    updatedAt: z.date(),
    totalSubTasks: z.number()
})

export type CreateTaskDto = z.infer<typeof createTaskInput>;
export type UpdateTaskDto = z.infer<typeof updateTaskInput>;
export type TaskDto = z.infer<typeof TaskOutput>;
export type PaginationDto = z.infer<typeof paginationInput>;
