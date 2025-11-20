import { type LoaderFunctionArgs, data } from "react-router";
import { userContext } from "~/lib/context";
import { getTasks } from "../task/service";
import { UnauthorizedError } from "../utils/error";
import { authRequire } from "../auth/middleware";


export const middleware = [authRequire];
export async function loader({ request, context }: LoaderFunctionArgs) {
    const user = context.get(userContext);
    if (user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("perPage") || "30");

    const result = await getTasks(user.id, { page, perPage });
    return data(result);
}
