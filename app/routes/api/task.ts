import { data, type ActionFunctionArgs, type ClientActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { userContext } from "~/lib/context";
import { authRequire } from "~/modules/auth/middleware";
import { CreateTaskInput, UpdateTaskInput } from "~/lib/schema";
import { createTask, deleteTask, getTask, updateTask } from "~/modules/task/service";
import { UnauthorizedError, BadRequestError, handleError } from "~/shared/utils/error";

export const middleware = [authRequire]

export async function loader({ context, params }: LoaderFunctionArgs) {
    const user = context.get(userContext);
    if (user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const taskId = params?.id;
    if (!taskId) {
        throw new BadRequestError('Task ID is required');
    }
    const task = await getTask(user.id, taskId)
    return data({ task });
}

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
                    return {
                        task: task
                    }
                }

            case "PUT":
                {
                    if (!taskId) {
                        throw new BadRequestError("Task ID is required");
                    }
                    const validationResult = UpdateTaskInput.safeParse(formData)
                    if (!validationResult.success) {
                        return data({ errors: Object.fromEntries(validationResult.error.issues.map(issue => [issue.path, issue.message])) }, {
                            status: 400
                        });
                    }
                    const task = await updateTask(user.id, taskId, validationResult.data)
                    return data({
                        task
                    });
                }
            case "DELETE": {
                if (!taskId) {
                    throw new BadRequestError("Task ID is required")
                }
                const task = await deleteTask(user.id, taskId)
                return data({ task})
            }
            default:
        }
    } catch (error) {
        console.error(error)
        const handled = handleError(error)
        throw data({ error: handled.message }, {
            status: handled.code
        })
    }
}
