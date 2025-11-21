import React from "react";
import { Outlet } from "react-router";
import { ActionBar } from "~/components/dashboard/ActionBar";
import { Stats } from "~/components/dashboard/Stats";
import { TaskList } from "~/components/dashboard/TaskList";



export default function Dashboard() {
    return <React.Fragment>
        <Stats />
        <Outlet />
    </React.Fragment>
}
