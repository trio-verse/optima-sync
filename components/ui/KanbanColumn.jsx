import { Plus } from "lucide-react";

export default function KanbanColumn({ title, count, badgeColor, onAddClick, children }) {
    return (
        <div className="flex flex-col bg-slate-50 rounded-xl border border-slate-100 p-2 min-w-[280px] max-w-[300px] h-[calc(100vh-250px)]">
            <div className="flex items-center justify-between p-2 mb-2">
                <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${badgeColor}`}>
                        {count}
                    </span>
                    <h3 className="text-sm font-bold text-slate-700">{title}</h3>
                </div>
                {onAddClick && (
                    <button onClick={onAddClick} className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50">
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>
            

            <div className="flex flex-col gap-2 flex-1 overflow-y-auto px-1 pb-2 custom-scrollbar">
                {children}
            </div>
        </div>
    );
}