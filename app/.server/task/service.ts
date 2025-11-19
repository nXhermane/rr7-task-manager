import { prisma } from "../utils/prisma";
import type { CreateTaskDto, TaskDto, UpdateTaskDto } from "./dtos";


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

export async function getTasks(userId: string): Promise<TaskDto[]> {
    const tasks = await prisma.task.findMany({
        where: {
            userId,
            parentId: null
        }
    })
    return tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        parentId: task.parentId,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    }));
}


export async function getSubTask(userId: string, taskId: string): Promise<TaskDto[]> {
    const tasks = await prisma.task.findMany({
        where: {
            userId,
            parentId: taskId
        }
    });
    return tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        parentId: task.parentId,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    }));
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

// task statss