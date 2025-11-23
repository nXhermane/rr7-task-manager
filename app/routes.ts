import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout('routes/_layout.tsx', [
        index('routes/dashboard.tsx')
    ]),
    ...prefix('auth', [
        route('signin', 'routes/auth/signin.tsx'),
        route('signup', 'routes/auth/signup.tsx'),
        route('signout', 'routes/auth/signout.tsx'),
    ])
    ,
    route('/api/task/:id?', 'routes/task.server.ts',),
    route('/api/task/:id/tasks','routes/task.sub.server.ts'),
    route('/api/task/:id/stats', 'routes/task.stats.server.ts'),
    route('/api/user/stats', 'routes/user.stats.server.ts'),
    route('/api/tasks', 'routes/tasks.server.ts'),
] satisfies RouteConfig
