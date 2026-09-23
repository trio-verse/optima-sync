"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Edit3, Trash2, X, Mail, AlertTriangle, Loader2 } from "lucide-react";
import { 
    getProjectEmployees, 
    createProjectEmployee, 
    updateProjectEmployee, 
    deleteProjectEmployee 
} from "@/actions/employeeActions";
import { getEmployees } from "@/actions/employees"; // لجلب موظفي المنظمة للقائمة المنسدلة

export default function TeamTab({
    projectId,
    orgId,
    activeVersionObj,
    isEditingAllowed,
}) {
    const router = useRouter();
    const [teamList, setTeamList] = useState([]);
    const [orgEmployees, setOrgEmployees] = useState([]); // لتخزين موظفي المنظمة
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingTeamId, setEditingTeamId] = useState(null);
    const [memberToDelete, setMemberToDelete] = useState(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form States
    const [employeeId, setEmployeeId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [totalPoints, setTotalPoints] = useState(10);
    const [costPerHour, setCostPerHour] = useState(20);
    const [hoursPerPoint, setHoursPerPoint] = useState(2);

    const fetchProjectEmployees = useCallback(async () => {
        if (!projectId || !orgId) return;
        setIsLoadingData(true);
        try {
            const res = await getProjectEmployees(projectId, orgId);
            const data = res?.data || res || [];
            setTeamList(data);
        } catch (err) {
            console.error("Error fetching project employees:", err);
        } finally {
            setIsLoadingData(false);
        }
    }, [projectId, orgId]);

    const fetchOrgEmployees = useCallback(async () => {
        if (!orgId) return;
        try {
            const res = await getEmployees(orgId);
            if (res?.success) setOrgEmployees(res.data || []);
        } catch (err) {
            console.error("Error fetching org employees:", err);
        }
    }, [orgId]);

    useEffect(() => {
        fetchProjectEmployees();
        fetchOrgEmployees();
    }, [fetchProjectEmployees, fetchOrgEmployees]);

    const handleOpenAddModal = () => {
        setEditingTeamId(null);
        setEmployeeId("");
        setName("");
        setEmail("");
        setPosition("");
        setTotalPoints(10);
        setCostPerHour(0);
        setHoursPerPoint(0);
        setIsMemberModalOpen(true);
    };

    const handleOpenEditModal = (member) => {
        setEditingTeamId(member.id);
        setEmployeeId(member.employee_id || "");
        setName(member.name || "");
        setEmail(member.email || "");
        setPosition(member.position || "");
        setTotalPoints(member.total_points || 0);
        setCostPerHour(member.cost_per_hour || 0);
        setHoursPerPoint(member.houres_per_point || 0);
        setIsMemberModalOpen(true);
    };

    // عند اختيار موظف من القائمة، تتعبأ البيانات تلقائياً
    const handleEmployeeSelect = (e) => {
        const selectedId = e.target.value;
        setEmployeeId(selectedId);
        
        const emp = orgEmployees.find(e => String(e.id) === String(selectedId));
        if (emp) {
            setName(emp.name || "");
            setEmail(emp.email || "");
            setPosition(emp.position || "");
            setCostPerHour(emp.cost_per_hour || 0);
            setHoursPerPoint(emp.houres_per_point || 0);
        }
    };

    const handleRequestDelete = (member) => {
        setMemberToDelete(member);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            employee_id: Number(employeeId),
            name,
            email,
            position,
            total_points: Number(totalPoints),
            cost_per_hour: Number(costPerHour),
            houres_per_point: Number(hoursPerPoint)
        };

        try {
            if (editingTeamId) {
                await updateProjectEmployee(projectId, editingTeamId, orgId, payload);
            } else {
                await createProjectEmployee(projectId, orgId, payload);
            }
            
            await fetchProjectEmployees();
            setIsMemberModalOpen(false);
            router.refresh();

        } catch (err) {
            console.error("Submit Error:", err);
            alert(`مشكلة في البيانات المُدخلة:\n${err.message || "حدث خطأ أثناء الحفظ"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!memberToDelete) return;
        setIsDeleting(true);
        try {
            await deleteProjectEmployee(projectId, memberToDelete.id, orgId);
            setTeamList(prev => prev.filter(m => m.id !== memberToDelete.id));
            setMemberToDelete(null);
            router.refresh();

        } catch (err) {
            console.error("Error deleting employee:", err);
            alert(err?.message || "An error occurred while deleting the employee.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">
                        Project Team Members
                        {activeVersionObj?.freeze && <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Frozen</span>}
                    </h3>
                    <p className="text-xs text-slate-500">Manage member allocations, email, points, and rates.</p>
                </div>
                {(isEditingAllowed || activeVersionObj?.freeze) && (
                    <button
                        onClick={handleOpenAddModal}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Team Member
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-3 sm:p-4 relative">
                {isLoadingData && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                )}

                <div className="block md:hidden space-y-3">
                    {teamList.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                            No members assigned to this project yet.
                        </div>
                    ) : (
                        teamList.map((member) => (
                            <div key={member.id} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{member.name}</h4>
                                        <p className="text-[11px] text-slate-500 break-all">{member.email || "N/A"}</p>
                                    </div>
                                    <span className="px-2 py-0.5 bg-slate-200/60 text-slate-700 rounded-md text-[10px] font-semibold shrink-0">
                                        {member.position || "Member"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/50 text-[11px]">
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Points</span>
                                        <span className="font-semibold text-slate-700">{member.total_points} pts</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Cost/Hr</span>
                                        <span className="text-slate-600">${member.cost_per_hour}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Total Cost</span>
                                        <span className="font-bold text-emerald-600">${member.calculated_cost}</span>
                                    </div>
                                </div>

                                {(isEditingAllowed || activeVersionObj?.freeze) && (
                                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/50">
                                        <button
                                            onClick={() => handleOpenEditModal(member)}
                                            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-medium flex items-center gap-1 shadow-sm active:bg-slate-100 cursor-pointer"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleRequestDelete(member)}
                                            className="px-3 py-1 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm active:bg-red-50 cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase">
                                <th className="py-3 px-4">Member Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Position</th>
                                <th className="py-3 px-4">Points</th>
                                <th className="py-3 px-4">Cost / Hr</th>
                                <th className="py-3 px-4">Hrs / Pt</th>
                                <th className="py-3 px-4">Total Cost</th>
                                {(isEditingAllowed || activeVersionObj?.freeze) && <th className="py-3 px-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {teamList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-slate-400">
                                        No members assigned to this project yet.
                                    </td>
                                </tr>
                            ) : (
                                teamList.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50">
                                        <td className="py-3 px-4 font-bold text-slate-800">{member.name}</td>
                                        <td className="py-3 px-4 text-slate-500">{member.email || "N/A"}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium">
                                                {member.position || "Member"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-slate-700">{member.total_points} pts</td>
                                        <td className="py-3 px-4 text-slate-600">${member.cost_per_hour}</td>
                                        <td className="py-3 px-4 text-slate-600">{member.houres_per_point}</td>
                                        <td className="py-3 px-4 font-bold text-emerald-600">${member.calculated_cost}</td>
                                        {(isEditingAllowed || activeVersionObj?.freeze) && (
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => handleOpenEditModal(member)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestDelete(member)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isMemberModalOpen && (
                <div 
                    onClick={() => !isSubmitting && setIsMemberModalOpen(false)}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 cursor-default"
                    >
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">
                                    {editingTeamId ? "Edit Member Details" : "Add Team Member"}
                                </h3>
                            </div>
                            <button 
                                disabled={isSubmitting}
                                onClick={() => setIsMemberModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForm} className="p-4 sm:p-5 space-y-4 text-xs">
                            
                            {/* قائمة منسدلة لاختيار الموظف من المنظمة */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Select Employee *</label>
                                <select
                                    value={employeeId}
                                    onChange={handleEmployeeSelect}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>-- Choose an Employee --</option>
                                    {orgEmployees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name} - {emp.position}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Member Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-8 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Position / Role</label>
                                    <input
                                        type="text"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Total Points *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={totalPoints}
                                        onChange={(e) => setTotalPoints(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs border-blue-200 bg-blue-50/30"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Cost / Hour ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={costPerHour}
                                        onChange={(e) => setCostPerHour(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Hrs / Point</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={hoursPerPoint}
                                        onChange={(e) => setHoursPerPoint(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-medium">Est. Calculated Cost:</span>
                                <span className="text-sm font-bold text-blue-600">
                                    ${(Number(totalPoints) || 0) * (Number(hoursPerPoint) || 0) * (Number(costPerHour) || 0)}
                                </span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setIsMemberModalOpen(false)}
                                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    {editingTeamId ? "Update Member" : "Attach Member"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {memberToDelete && (
                <div 
                    onClick={() => !isDeleting && setMemberToDelete(null)}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center cursor-default"
                    >
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                            <AlertTriangle className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Remove Member?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to remove <span className="font-semibold text-slate-800">{memberToDelete.name}</span> from this project?
                            </p>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                disabled={isDeleting}
                                onClick={() => setMemberToDelete(null)}
                                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isDeleting}
                                onClick={handleDeleteConfirm}
                                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                Confirm Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}