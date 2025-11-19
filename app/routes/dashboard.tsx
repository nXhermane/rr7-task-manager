import React from "react";
import { ActionBar } from "~/components/dashboard/ActionBar";
import { Stats } from "~/components/dashboard/Stats";



export default function Dashboard() {
    return <React.Fragment>
        <Stats />
        <ActionBar />
    </React.Fragment>
}
