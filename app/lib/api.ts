import { createTaskInput, updateTaskInput } from "./schema";
import type { CreateTaskInput as CreateTaskDto, PaginatedData, Task, TaskStats, UpdateTaskDto } from "./types";


export const addSubTask = async (taskId: string, dto: CreateTaskDto): Promise<{ task: Task }> => {
    const validationResult = createTaskInput.parse(dto)
    const formData = new FormData()
    Object.entries(validationResult).forEach(([key, value]) => formData.append(key, value as any))
    const res = await fetch(`/api/task/${taskId}/tasks`, {
        method: "POST",
        body: formData
    })
    if (res.ok) {
        const result = await res.json()
        return result
    } else {
        const error = await res.json()
        throw error
    }
}
export const addTask = async (dto: CreateTaskDto): Promise<{ task: Task }> => {
    const validationResult = createTaskInput.parse(dto)
    const formData = new FormData()
    Object.entries(validationResult).forEach(([key, value]) => formData.append(key, value as any))
    const res = await fetch(`/api/task`, {
        method: "POST",
        body: formData
    })
    if (res.ok) {
        const result = await res.json()
        return result
    } else {
        const error = await res.json()
        throw error
    }
}

export const updateTask = async (taskId: string, dto: UpdateTaskDto): Promise<{ task: Task }> => {
    const validationResult = updateTaskInput.parse(dto)
    const formData = new FormData()
    Object.entries(validationResult).forEach(([key, value]) => formData.append(key, value as any))
    const res = await fetch(`/api/task/${taskId}`, {
        method: "PUT",
        body: formData
    })
    if (res.ok) {
        const result = await res.json()
        return result
    } else {
        const error = await res.json()
        throw error
    }
}
export const deleteTask = async (taskId: string): Promise<{ task: Task }> => {
    const res = await fetch(`/api/task/${taskId}`, {
        method: "DELETE",
        body: new FormData()
    })
    if (res.ok) {
        return res.json()
    } else {
        const error = await res.json()
        throw error
    }
}
export const getTask = async (taskId: string): Promise<{ task: Task }> => {
    const res = await fetch('/api/task/' + taskId)
    if (res.ok) {
        return res.json()
    } else {
        const error = await res.json()
        throw error
    }
}

export const getPaginatedTask = async (page: number, perPage: number = 20): Promise<PaginatedData<Task>> => {
    const res = await fetch(`/api/tasks?page=${page}&perPage=${perPage}`)
    if (res.ok) {
        return res.json()
    } else {
        const error = await res.json()
        throw error
    }
}
export const getPaginatedSubTask = async (taskId: string, page: number, perPage: number = 20): Promise<PaginatedData<Task>> => {
    const res = await fetch(`/api/task/${taskId}/tasks?page=${page}&perPage=${perPage}`)
    if (res.ok) {
        return res.json()
    } else {
        const error = await res.json()
        throw error
    }
}
export const getUserStats = async (): Promise<{ userId: string, stats: TaskStats }> => {
    const res = await fetch('/api/user/stats')
    if (res.ok) {
        return res.json()
    } else {
        const error = await res.json()
        throw error
    }
}
export const getTaskStats = async (taskId: string): Promise<{ taskId: string, stats: TaskStats }> => {
    const res = await fetch(`/api/task/${taskId}/stats`)
    if (res.ok) {
        return res.json()
    } else {
        const error = await res.json()
        throw error
    }
}
