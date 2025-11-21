
import { data, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { userContext } from "~/lib/context";
import { BadRequestError, handleError, UnauthorizedError } from "../utils/error";
import { authRequire } from "../auth/middleware";
import { CreateTaskInput, UpdateTaskInput } from "~/lib/schema";

export const middleware = [authRequire]



export async function loader ({request}: LoaderFunctionArgs) {
    return data({data: 'wel'})
}
export async function action({ request,context }: ActionFunctionArgs) {
    console.log("form data", await request.formData())
    return data({ data: 'ok' })
}