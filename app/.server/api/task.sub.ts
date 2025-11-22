import { data, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { authRequire } from "../auth/middleware";
import { userContext } from "~/lib/context";
import { CreateTaskInput } from "~/lib/schema";

export const middleware = [authRequire];


export async function loader({ request, context, params }: LoaderFunctionArgs) {
    const { UnauthorizedError, BadRequestError } = await import('./../utils/error')
    const { getSubTask } = await import('./../task/service')
    const user = context.get(userContext);
    if (user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const taskId = params?.id;
    if (!taskId) {
        throw new BadRequestError('Task ID is required');
    }
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("perPage") || "30");
    const tasks = await getSubTask(user.id, taskId, { page, perPage });
    return data(tasks);
}




export async function action({ context, request, params }: ActionFunctionArgs) {
    const { UnauthorizedError, BadRequestError, handleError } = await import('./../utils/error')
    const { createSubTask } = await import('./../task/service')
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
                    if (!taskId) {
                        throw new BadRequestError("Task ID is required")
                    }
                    const validationResult = CreateTaskInput.safeParse(formData)
                    if (!validationResult.success) {
                        return data({
                            errors: Object.fromEntries(validationResult.error.issues.map(issue => [issue.path, issue.message]))
                        },{
                            status: 400
                        });
                    }
                    const task = await createSubTask(user.id, taskId, validationResult.data)
                    return {
                        task: task
                    }
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
