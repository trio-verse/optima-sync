"use client";

import Link from "next/link";
import { Building2, Calendar, Plus, ArrowLeft, Loader2, Eye, FileDown } from "lucide-react";
//import { Eye, FileDown, Loader2 } from "lucide-react";
//import { previewQuotation, generateQuotationPdf } from "@/actions/quotationActions";
export default function ProjectHeader({
    project = {},
    currentVersion = {},
    versionsData = [],
    orgId,
    selectedVersionId,
    setSelectedVersionId
}) {
    //const [previewing, setPreviewing] = useState(false);
    //const [generating, setGenerating] = useState(false);
    const allVersions = [...(versionsData || [])];
    
    if (currentVersion?.id && !allVersions.find(v => v.id === currentVersion.id)) {
        allVersions.push(currentVersion);
    }

    allVersions.sort((a, b) => b.version_number - a.version_number);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? dateString : d.toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };
    // const handlePreview = async () => {
    //     setPreviewing(true);
    //     const res = await previewQuotation(projectId, orgId);
    //     setPreviewing(false);
        
    //     if (res.success && res.html) {
    //         // فتح شاشة جديدة لعرض الـ HTML
    //         const newWindow = window.open("", "_blank");
    //         newWindow.document.write(res.html);
    //         newWindow.document.close();
    //     } else {
    //         alert(res.message);
    //     }
    // };

    // const handleGeneratePDF = async () => {
    //     setGenerating(true);
    //     const res = await generateQuotationPdf(projectId, orgId);
    //     setGenerating(false);
        
    //     if (res.success && res.pdf_url) {
    //         // فتح أو تحميل الـ PDF
    //         window.open(res.pdf_url, "_blank");
    //         // إذا كنت تريد إعادة تحميل الصفحة لتحديث حالة الـ Version بعد الـ Freeze:
    //         // router.refresh();
    //     } else {
    //         alert(res.message);
    //     }
    //};
    return (
        <div className="space-y-4">
            {/* الشريط العلوي: زر العودة + أزرار الإجراءات الرئيسية */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link
                    href={`/${orgId}/dashboard/projects`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 hover:bg-slate-50 w-fit shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>

                {/* أزرار عرض السعر (Quotation Actions) */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        // onClick={handlePreview}
                        // disabled={previewing}
                        className="flex-1 sm:flex-none justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 flex items-center gap-2 transition shadow-sm disabled:opacity-50 group"
                    >
                        {/* {previewing ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />} */}
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span>Preview Quotation</span>
                    </button>

                    <button
                        // onClick={handleGeneratePDF}
                        // disabled={generating}
                        className="flex-1 sm:flex-none justify-center px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-2 transition shadow-sm disabled:opacity-50"
                    >
                        {/* {generating ? <Loader2 className="w-4 h-4 animate-spin text-white/70" /> : <FileDown className="w-4 h-4" />} */}
                        <FileDown className="w-4 h-4" />
                        <span>Generate PDF</span>
                    </button>
                </div>
            </div>

            {/* بطاقة معلومات المشروع الرئيسية (Main Card) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* القسم الأيسر: معلومات المشروع والعميل */}
                <div className="flex items-start gap-4 w-full lg:w-auto">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 rounded-2xl border border-blue-100/50 shadow-sm shrink-0">
                        <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                            {project.title || "Untitled Project"}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 sm:mt-2.5 text-xs">
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                <span className="font-semibold text-slate-400">Client:</span>
                                <span className="font-bold text-slate-700 truncate max-w-[150px] sm:max-w-[200px]">
                                    {project?.client_details?.name || "No Client Assigned"}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 px-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-medium text-slate-500">
                                    Created on {formatDate(project?.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* القسم الأيمن: القائمة المنسدلة للنسخ */}
                <div className="flex items-center lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 w-full lg:w-auto shrink-0">
                    <div className="w-full sm:w-auto bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            Viewing Version
                        </label>
                        <select
                            value={selectedVersionId || ""}
                            onChange={(e) => setSelectedVersionId(Number(e.target.value))}
                            className="w-full sm:w-[200px] bg-white border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm transition-all"
                        >
                            {allVersions.map((v) => (
                                <option key={v.id} value={v.id}>
                                    Version {v.version_number} {v.freeze ? '(Locked)' : '(Active)'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
            </div>
        </div>
    );
}