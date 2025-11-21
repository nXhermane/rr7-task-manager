import z from "zod";
import { TastkStatus } from "../generated/prisma/enums";
import type { CreateTaskInput, PaginationInput, UpdateTaskInput } from "~/lib/schema";

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

export type CreateTaskDto = z.infer<typeof CreateTaskInput>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskInput>;
export type TaskDto = z.infer<typeof TaskOutput>;
export type PaginationDto = z.infer<typeof PaginationInput>;
