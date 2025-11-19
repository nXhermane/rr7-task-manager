import { Outlet, redirect, type MiddlewareFunction } from "react-router";
import { authRequire } from "~/.server/auth/middleware";
import { Header } from "~/components/dashboard/Header";
import type { Route } from "./+types/_layout";
import { userContext } from "~/lib/context";
import { getTasks } from "~/.server/task/service";
import type { Task, User } from "~/lib/types";

export const middleware: MiddlewareFunction[] = [authRequire];

export const loader = async ({ context }: Route.LoaderArgs) => {
    const user = context.get(userContext);
    if (user === null) {
        return redirect("/auth/signin", { status: 302 });
    }
    const tasks = await getTasks(user.id)
    return { user, tasks }
};

export type DashboardContextType = [User, Task[]];

export default function Layout({ loaderData: { user, tasks } }: Route.ComponentProps) {
    
    return <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
        <Header user={user} />
        <main className="container mx-auto px-6 py-8">
            <Outlet context={[user, tasks] satisfies DashboardContextType} />
        </main>
    </div>
}
