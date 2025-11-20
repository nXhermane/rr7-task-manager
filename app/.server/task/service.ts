import { TastkStatus } from "../generated/prisma/enums";
import { NotFoundError } from "../utils/error";
import { prisma } from "../utils/prisma";
import type { CreateTaskDto, PaginatedData, PaginationDto, TaskDto, TaskStats, UpdateTaskDto } from "./dtos";


export async function createTask(userId: string, dto: CreateTaskDto): Promise<TaskDto> {
    const task = await prisma.task.create({
        data: {
            userId,
            title: dto.title,
            description: dto.description
        }
    });
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        parentId: task.parentId,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    }
}

export async function getTask (userId: string , taskId: string): Promise<TaskDto> {
    const task = await  prisma.task.findUnique({
        where: {
            id: taskId,
            userId,
        },
    });
    if(task === null) {
        throw new NotFoundError(`Task with id ${taskId} not found`)
    }
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        parentId: task.parentId,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    }
}

export async function getTasks(userId: string, pagination: PaginationDto): Promise<PaginatedData<TaskDto>> {
    const [tasks, count] = await Promise.all([
        prisma.task.findMany({
            skip: (pagination.page - 1) * pagination.perPage,
            take: pagination.perPage,
            where: {
                userId,
                parentId: null
            },
        }),
        prisma.task.count({
            where: {
                userId,
                parentId: null
            }
        })
    ]);
    return {
        data: tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            parentId: task.parentId,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        })),
        total: count,
        page: pagination.page,
        perPage: pagination.perPage,
        totalPage: Math.ceil(count / pagination.perPage),
    }
}

export async function getSubTask(userId: string, taskId: string, pagination: PaginationDto): Promise<PaginatedData<TaskDto>> {
    const [tasks, count] = await Promise.all([
        prisma.task.findMany({
            skip: (pagination.page - 1) * pagination.perPage,
            take: pagination.perPage,
            where: {
                userId,
                parentId: taskId
            },
        }),
        prisma.task.count({
            where: {
                userId,
                parentId: taskId
            }
        })
    ])
    return {
        data: tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            parentId: task.parentId,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        })),
        total: count,
        page: pagination.page,
        perPage: pagination.perPage,
        totalPage: Math.ceil(count / pagination.perPage),
    }
}

export async function updateTask(userId: string, taskId: string, dto: UpdateTaskDto): Promise<TaskDto> {
    const task = await prisma.task.update({
        where: {
            id: taskId,
            userId,
        },
        data: {
            title: dto.title || undefined,
            description: dto.description || undefined,
            status: dto.status || undefined,
        },
    });
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        parentId: task.parentId,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    };
}
export async function deleteTask(userId: string, taskId: string) {
    await prisma.task.delete({
        where: {
            userId, id: taskId
        }
    })
}

export async function getUserTaskStats(userId: string): Promise<TaskStats> {
    const [total, completed, pending, inProgress] = await Promise.all([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: TastkStatus.COMPLETED } }),
        prisma.task.count({ where: { userId, status: TastkStatus.PENDING } }),
        prisma.task.count({ where: { userId, status: TastkStatus.IN_PROGRESS } }),
    ]);
    return { total, completed, pending, inProgress };
}
export async function getTaskStats(userId: string, taskId: string): Promise<TaskStats> {
    const [total, completed, pending, inProgress] = await Promise.all([
        prisma.task.count({ where: { userId, parentId: taskId } }),
        prisma.task.count({ where: { userId, status: TastkStatus.COMPLETED, parentId: taskId } }),
        prisma.task.count({ where: { userId, status: TastkStatus.PENDING, parentId: taskId } }),
        prisma.task.count({ where: { userId, status: TastkStatus.IN_PROGRESS, parentId: taskId } }),
    ]);
    return { total, completed, pending, inProgress };
}
