import { type LoaderFunctionArgs, data } from "react-router";
import { userContext } from "~/lib/context";
import { getTasks } from "../task/service";
import { UnauthorizedError } from "../utils/error";
import { authRequire } from "../auth/middleware";
import type { PaginationDto } from "../task/dtos";
import { queryOptions } from "@tanstack/react-query";
import { queryClient } from "~/lib/query_client";


export const middleware = [authRequire];

export const tasksQuery = (userId: string, pagination: PaginationDto) => {
    return queryOptions({
        queryKey: ["tasks", `${pagination.page}:${pagination.perPage}`],
        queryFn: async () => await getTasks(userId, pagination),
        enabled: !!userId
    })
}
export async function loader({ request, context }: LoaderFunctionArgs) {
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
