export default function Table({ headers = [], data = [], renderRow, emptyMessage = "No data available" }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" dir="ltr">
                    <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {headers.map((header, index) => (
                                <th key={index} className="py-3 px-4">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="py-8 text-center text-slate-400 text-xs font-medium">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIndex) => renderRow(item, rowIndex))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}