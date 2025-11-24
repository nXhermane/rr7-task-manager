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
    route('/api/task/:id?', 'routes/api/task.ts',),
    route('/api/task/:id/tasks','routes/api/task.sub.ts'),
    route('/api/task/:id/stats', 'routes/api/task.stats.ts'),
    route('/api/user/stats', 'routes/api/user.stats.ts'),
    route('/api/tasks', 'routes/api/tasks.ts'),
] satisfies RouteConfig
