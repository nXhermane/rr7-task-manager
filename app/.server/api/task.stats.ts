import { data, type LoaderFunctionArgs } from "react-router";
import { authRequire } from "../auth/middleware";
import { userContext } from "~/lib/context";
;

export const middleware = [authRequire]

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const {getTaskStats} = await import("../task/service")
  const {BadRequestError, UnauthorizedError} = await import("./../utils/error")
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

