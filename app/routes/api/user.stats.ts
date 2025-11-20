import { data, type LoaderFunctionArgs } from "react-router";
import { authRequire } from "../../server/auth/middleware";
import { userContext } from "~/lib/context";
import { UnauthorizedError } from "../../server/utils/error";
import { getUserTaskStats } from "../../server/task/service";
import { queryOptions } from "@tanstack/react-query";
import { queryClient } from "~/lib/query_client";



export const middleware = [authRequire]
export const userStatsQuery = (userId: string) => {
    return queryOptions({
        queryKey: ["userStats", userId],
        queryFn: async () => await getUserTaskStats(userId),
        enabled: !!userId
    })
}
export async function loader({ request, context }: LoaderFunctionArgs) {
    const user = context.get(userContext);
    if (user === null) {
        throw new UnauthorizedError('You must be logged in to access this resource.')
    }
    const userStats = await getUserTaskStats(user.id);
    return data({userId: user.id,stats: userStats});
}
