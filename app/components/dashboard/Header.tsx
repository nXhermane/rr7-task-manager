import type { User } from "~/lib/types"
import { Button } from "../ui/button"
import { NavLink } from "react-router"

interface HeaderProps {
    user: User
}

export function Header({ user }: HeaderProps) {

    return <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-400">Bienvenue, <span className="text-white font-semibold">{user.name}</span></span>
                    <NavLink to={'/auth/signout'}>
                        <Button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition">
                            Déconnexion
                        </Button>
                    </NavLink>
                </div>
            </div>
        </div>
    </header>

}