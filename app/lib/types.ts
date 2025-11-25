

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  parentId: string | null;
  status:  "PENDING" | "IN_PROGRESS" | "COMPLETED"
  createdAt: string;
  updatedAt: string;
  totalSubTasks: number
}

export type CreateTaskInput = {
  title: string;
  description?: string;
}
export type TaskStats = {
    total: number
    completed: number
    pending: number
    inProgress: number
}
export type PaginatedData<T> = {
    data: T []
    total: number
    page: number
    perPage: number
    totalPage: number
}


export type UpdateTaskDto = {
    title?: string | null | undefined;
    description?: string | null | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined;
}