import { getSession } from "~/lib/session";
import { data, redirect, type MiddlewareFunction } from "react-router";
import { userContext } from "~/lib/context";

export const authRequire: MiddlewareFunction = async ({ request, context, }) => {
    const {getUser} = await import ("./../user/service")
    const {handleError} = await import ("./../utils/error")
    const { verifyToken} = await import("./../utils/helpers")
    try {
        const session = await getSession(request.headers.get("Cookie"));
        if (!session.has("token")) {
            //   throw new UnauthorizedError("You must be logged in to access this resource.");
            return redirect("/auth/signin", {
                status: 302
            })
        }
        const payload = verifyToken(session.get("token")) as { id: string }
        const user = await getUser(payload.id)
        context.set(userContext, user)
    } catch (error) {
        const handledError = handleError(error);
        return data({
            status: handledError.code,
            errors: handledError.message
        })
    }
}