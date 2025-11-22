import type { PaginatedData, TaskStats } from "~/lib/types";
import { TastkStatus } from "../generated/prisma/enums";
import { BadRequestError, NotFoundError } from "../utils/error";
import { prisma } from "../utils/prisma";
import type { CreateTaskDto, PaginationDto, TaskDto, UpdateTaskDto } from "./dtos";


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
        totalSubTasks: 0
    }
}

export async function createSubTask(userId: string, parentId: string, dto: CreateTaskDto): Promise<TaskDto> {
    const exists = await prisma.task.findUnique({
        where: {
            id: parentId,
            userId: userId
        }
    })
    if (exists === null) {
        throw new BadRequestError('The parent task not found')
    }
    const task = await prisma.task.create({
        data: {
            userId,
            parentId,
            title: dto.title,
            description: dto.description,
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
        totalSubTasks: 0
    }
}

export async function getTask(userId: string, taskId: string): Promise<TaskDto> {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
            userId,
        },
        include: {
            _count: {
                select: {
                    subtasks: true
                }
            }
        }
    });
    if (task === null) {
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
        totalSubTasks: task._count.subtasks
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
            include: {
                _count: {
                    select: {
                        subtasks: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
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
            totalSubTasks: task._count.subtasks
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
            include: {
                _count: {
                    select: {
                        subtasks: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
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
            totalSubTasks: task._count.subtasks
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
            description: dto.description,
            status: dto.status || undefined,
        },
        include: {
            _count: {
                select: {
                    subtasks: true
                }
            }
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
        totalSubTasks: task._count.subtasks
    }

}
export async function deleteTask(userId: string, taskId: string) {
    const task = await prisma.task.delete({
        where: {
            userId, id: taskId
        },
        include: {
            _count: {
                select: {
                    subtasks: true
                }
            }
        }
    })
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        parentId: task.parentId,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        totalSubTasks: task._count.subtasks
    }
}

export async function getUserTaskStats(userId: string): Promise<TaskStats> {
    const [total, completed, pending, inProgress] = await Promise.all([
        prisma.task.count({ where: { userId, parentId: null } }),
        prisma.task.count({ where: { userId, status: TastkStatus.COMPLETED, parentId: null } }),
        prisma.task.count({ where: { userId, status: TastkStatus.PENDING, parentId: null } }),
        prisma.task.count({ where: { userId, status: TastkStatus.IN_PROGRESS, parentId: null } }),
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
