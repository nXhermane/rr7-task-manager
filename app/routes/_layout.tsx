import { Outlet, redirect, type MiddlewareFunction } from "react-router";
import { authRequire } from "~/modules/auth/middleware";
import { Header } from "~/components/dashboard/Header";
import type { Route } from "./+types/_layout";
import { userContext } from "~/lib/context";
import type { User } from "~/lib/types";

export const middleware: MiddlewareFunction[] = [authRequire];

export const loader = async ({ context }: Route.LoaderArgs) => {
    const user = context.get(userContext);
    if (user === null) {
        return redirect("/auth/signin", { status: 302 });
    }
    return { user }
};

export type DashboardContextType = [User];

export default function Layout({ loaderData: { user } }: Route.ComponentProps) {
    return <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
        <Header user={user} />
        <main className=" min-w-screen h-full overflow-hidden" >
            <Outlet context={[user] satisfies DashboardContextType} />
        </main>
    </div>
}
