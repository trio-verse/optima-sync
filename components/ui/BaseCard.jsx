export default function BaseCard({ 
    children, 
    className = "", 
    onClick 
}) {
   
    const clickableClasses = onClick 
        ? "cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all active:scale-[0.99]" 
        : "";

    return (
        <div 
            onClick={onClick}
            className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 ${clickableClasses} ${className}`}
        >

            {children}
        </div>
    );
}