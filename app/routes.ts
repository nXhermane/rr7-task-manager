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
    route('/api/task/:id?', '.server/api/task.ts')
] satisfies RouteConfig
