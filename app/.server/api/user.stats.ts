import { data, type LoaderFunctionArgs } from "react-router";
import { authRequire } from "../auth/middleware";
import { userContext } from "~/lib/context";



export const middleware = [authRequire]

export async function loader({ request, context }: LoaderFunctionArgs) {
    const {getUserTaskStats} = await import ("./../task/service")
    const {UnauthorizedError} = await import ("./../utils/error")
    const user = context.get(userContext);
    if (user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const userStats = await getUserTaskStats(user.id);
    return data({userId: user.id,stats: userStats});
}
