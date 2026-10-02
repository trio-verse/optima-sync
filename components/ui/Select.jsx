import { ChevronDown } from "lucide-react";

export default function Select({ 
    label, 
    options = [], 
    value, 
    onChange, 
    name, 
    placeholder = "اختر...", 
    disabled = false,
    className = "" 
}) {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                <label className="text-sm font-bold text-slate-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((opt, index) => (
                        <option key={opt.value || index} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                
                <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
        </div>
    );
}