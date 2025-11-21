import { data, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { userContext } from "~/lib/context";
import { createTask, deleteTask, getTask, updateTask } from "../task/service";
import { BadRequestError, handleError, UnauthorizedError } from "../utils/error";
import { authRequire } from "../auth/middleware";
import { CreateTaskInput, UpdateTaskInput } from "~/lib/schema";

export const middleware = [authRequire]


// export async function loader({ request, context, params }: LoaderFunctionArgs) {
//     const user = context.get(userContext);
//     if (user === null) {
//         throw new UnauthorizedError('You must be logged in to access this resource.')
//     }
//     const taskId = params?.id;
//     if(!taskId) {
//         throw new BadRequestError('Task ID is required');
//     }
//     const task = await getTask(user.id, taskId)
//     return data({ task });
// }

export async function action({ context, request, params }: ActionFunctionArgs) {
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
                    console.log(task)
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
                        task: task
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

