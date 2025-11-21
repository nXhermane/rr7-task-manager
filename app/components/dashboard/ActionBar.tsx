import { useState } from "react";
import { Button } from "../ui/button";
import { AddTaskModal } from "./AddTaskModal";

export function ActionBar () {
    const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
    return  <>
   <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button onClick={() => {
            console.log("Opening add task modal");
            setShowAddTaskModal(true);
        }} className="px-6 py-3 h-12 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold flex items-center space-x-2 transition shadow-lg shadow-blue-500/25">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Nouvelle Tâche</span>
        </Button>
        
        <select className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" id="filter-status">
          <option value="all">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="COMPLETED">Terminées</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Button className="p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition" title="Vue liste">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </Button>
        <Button className="p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition" title="Vue grille">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </Button>
      </div>
    </div>
   <AddTaskModal isVisible={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} />
     </>
}