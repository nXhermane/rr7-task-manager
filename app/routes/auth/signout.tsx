import { destroySession, getSession } from "~/lib/session";
import type { Route } from "./+types/signout";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const destroySessionResult = await destroySession(session);
    return redirect("/auth/signin", { headers: { "Set-Cookie": destroySessionResult } });
}