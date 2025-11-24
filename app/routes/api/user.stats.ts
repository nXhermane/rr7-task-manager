import { data, type LoaderFunctionArgs } from "react-router";
import { authRequire } from "~/modules/auth/middleware";
import { userContext } from "~/lib/context";
import { UnauthorizedError } from "~/shared/utils/error";
import { getUserTaskStats } from "~/modules/task/service";



export const middleware = [authRequire]

export async function loader({ request, context }: LoaderFunctionArgs) {
    const user = context.get(userContext);
    if (user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const userStats = await getUserTaskStats(user.id);
    return data({userId: user.id,stats: userStats});
}
