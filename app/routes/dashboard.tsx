import React from "react";
import { Stats } from "~/components/dashboard/Stats";
import { Tasks } from "~/components/dashboard/Tasks";




export default function Dashboard() {
    return <React.Fragment>
        <Stats />
       <Tasks />
    </React.Fragment>
}
