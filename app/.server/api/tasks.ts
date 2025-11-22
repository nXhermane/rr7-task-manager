import { type LoaderFunctionArgs, data } from "react-router";
import { userContext } from "~/lib/context";
import { authRequire } from "../auth/middleware";


export const middleware = [authRequire];

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { getTasks } = await import("./../task/service")
    const { UnauthorizedError } = await import("./../utils/error")
    const user = context.get(userContext);
    if (user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("perPage") || "30");
    const tasks = await getTasks(user.id, { page, perPage });
    return data(tasks);
}
