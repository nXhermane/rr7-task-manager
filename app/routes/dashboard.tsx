import React from "react";
import { Stats } from "~/components/dashboard/Stats";
import { Tasks } from "~/components/dashboard/Tasks";
import { useIsMobile } from "~/hooks/use-mobile";




export default function Dashboard() {
    const isMobile = useIsMobile()
    if (isMobile) {
        return <div className="h-screen flex justify-center items-center w-full  p-4 text-center text-sm text-muted-foreground">
            La version mobile de ce site n'est pas disponible
        </div>
    }
    return <React.Fragment>
        <Stats />
        <Tasks />
    </React.Fragment>
}
