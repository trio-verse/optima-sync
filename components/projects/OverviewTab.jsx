"use client";

import { CheckCircle2, User, Mail, Phone, Calendar } from "lucide-react";

export default function OverviewTab({ project, activeVersionObj }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* القسم الرئيسي: تفاصيل المشروع والعميل */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Project Description</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {project?.description || "No description provided."}
                    </p>
                    

                </div>
            </div>

            {/* القسم الجانبي: ملخص النسخة النشطة */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Selected Version Summary</h3>
                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-50">
                            <span className="text-slate-400">Version Number</span>
                            <span className="font-semibold text-slate-800">
                                {activeVersionObj?.version_number ? `v${activeVersionObj.version_number}` : "-"}
                            </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                            <span className="text-slate-400">Duration</span>
                            <span className="font-semibold text-slate-800">
                                {activeVersionObj?.duration || "-"}
                            </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                            <span className="text-slate-400">Version State</span>
                            <span className={`font-semibold ${activeVersionObj?.freeze ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {activeVersionObj?.freeze ? 'Frozen (Locked)' : 'Active (Editable)'}
                            </span>
                        </div>
                        <div className="flex justify-between py-1 mt-2">
                            <span className="text-slate-400">Project Status</span>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase text-[10px] tracking-wide">
                                {project?.status?.replace('_', ' ') || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}