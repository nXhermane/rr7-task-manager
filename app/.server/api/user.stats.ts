import { data, type LoaderFunctionArgs } from "react-router";
import { authRequire } from "../auth/middleware";
import { userContext } from "~/lib/context";
import { UnauthorizedError } from "../utils/error";
import { getUserTaskStats } from "../task/service";



export const middleware = [authRequire]

export async function loader ({request,context} : LoaderFunctionArgs) {
    const user = context.get(userContext);
    if(user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const userStats = await getUserTaskStats(user.id);
    return data(userStats);
}
