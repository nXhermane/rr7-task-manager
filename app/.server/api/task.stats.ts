import { data, type ClientLoaderFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { authRequire } from "../auth/middleware";
import { userContext } from "~/lib/context";
import { BadRequestError, UnauthorizedError } from "../utils/error";
import { getTaskStats } from "../task/service";
import { queryOptions } from "@tanstack/react-query";
import { queryClient } from "~/lib/query_client";

export const middleware = [authRequire]
export const taskStatsQuery = (userId: string, taskId: string) => {
  return queryOptions({
    queryKey: ["taskStats", taskId],
    queryFn: async () => await getTaskStats(userId, taskId),
    enabled: !!userId && !!taskId
  })
}

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const user = context.get(userContext);
  if (user === null) {
    throw new UnauthorizedError('You must be logged in to access this resource.')
  }
  const taskId = params?.id;
  if (!taskId) {
    throw new BadRequestError('Task ID is required');
  }
  const stats = await getTaskStats(user.id, taskId)
  return data({ taskId, stats })
}

