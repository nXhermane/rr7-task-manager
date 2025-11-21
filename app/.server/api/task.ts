import { data, type ActionFunctionArgs, type ClientActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { userContext } from "~/lib/context";
import { authRequire } from "../auth/middleware";
import { CreateTaskInput, UpdateTaskInput } from "~/lib/schema";

export const middleware = [authRequire]

export async function loader({ context, params }: LoaderFunctionArgs) {
    const {UnauthorizedError,BadRequestError} = await import('./../utils/error')
    const {getTask} = await import('./../task/service')
    const user = context.get(userContext);
    if (user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const taskId = params?.id;
    if(!taskId) {
        throw new BadRequestError('Task ID is required');
    }
    const task = await getTask(user.id, taskId)
    return data({ task });
}

export async function action({ context, request, params }: ActionFunctionArgs) {
    const { UnauthorizedError, handleError } = await import('./../utils/error')
    const { createTask, deleteTask, updateTask } = await import('./../task/service')
    try {
        const requestMethod = request.method;
        const formData = Object.fromEntries(await request.formData())
        const user = context.get(userContext)
        const taskId = params?.id;
        if (user === null) {
            throw new UnauthorizedError('You must be logged in to access this resource.')
        }
        switch (requestMethod) {
            case "POST":
                {
                    const validationResult = CreateTaskInput.safeParse(formData)
                    if (!validationResult.success) {
                        return data({
                            status: 400,
                            errors: Object.fromEntries(validationResult.error.issues.map(issue => [issue.path, issue.message]))
                        });
                    }
                    const task = await createTask(user.id, validationResult.data)
                    return {
                        task: task
                    }
                }

            case "PUT":
                {
                    if (!taskId) {
                        return data({
                            status: 400,
                            error: "Task ID is required"
                        });
                    }
                    const validationResult = UpdateTaskInput.safeParse(formData)
                    if (!validationResult.success) {
                        return data({
                            status: 400,
                            errors: Object.fromEntries(validationResult.error.issues.map(issue => [issue.path, issue.message]))
                        });
                    }
                    const task = await updateTask(user.id, taskId, validationResult.data)
                    return data({
                        task: task,
                        message: 'Task updated successfully'
                    });
                }
            case "DELETE": {
                if (!taskId) {
                    return data({
                        status: 400,
                        error: "Task ID is required"
                    });
                }
                await deleteTask(user.id, taskId)
                return data({
                    status: 200,
                    message: "Task deleted successfully"
                })
            }
            default:
        }
    } catch (error) {
        console.error(error)
        const handled = handleError(error)
        return data({
            status: handled.code,
            error: handled.message
        });
    }
}
