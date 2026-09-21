"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    Link2, 
    Copy, 
    Check, 
    FolderKanban, 
    ExternalLink, 
    Loader2, 
    RefreshCw, 
    Paperclip,
    FileText,
    Search,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronRight,
    Plus,
    X,
    Pencil,
    Trash2,
} from "lucide-react";

// استيراد الأكشنز والـ Lookups
import { getProjects, createProject, updateProject, deleteProject } from "@/actions/projectAction"; 
import { getClients, createClient } from "@/actions/clientActions";
import { useClientLookups } from "@/hooks/useClientLookups";

// 👇 استيراد مكون المودال الذي أنشأناه للتو
import ProjectFormModal from "./ProjectModal"; // عدل المسار إذا لزم الأمر

export default function ProjectsTable({ orgId }) {
    const queryClient = useQueryClient();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // حالات جلب العملاء مباشرة عبر getClients
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);

    // جلب قائمة المدن والصناعات لإضافتها للعميل الجديد
    const { cities, industries, loadingLookups } = useClientLookups(orgId);

    // حالات مودال إنشاء وتعديل المشروع
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    
    // حالة إضافة عميل جديد داخل النموذج بجميع الحقول لتفادي Validation Fail
    const [isAddingNewClient, setIsAddingNewClient] = useState(false);
    const [newClientData, setNewClientData] = useState({ 
        name: "", 
        type: "individual",
        city_id: "",
        industry_id: "",
        phone: "",
        email: "",
        whatsapp: "",
        facebook: "",
        instagram: "",
        website: "",
        address: "",
        notes: ""
    });
    const [clientAddError, setClientAddError] = useState("");

    const [newProjectForm, setNewProjectForm] = useState({
        title: "",
        description: "",
        subTotal: "",
        profitPercentage: "20",
        clientId: "",
        clientName: "",
        clientEmail: "",
        status: "pending",
        deadline: "2026-12-31",
        startDate: "",
        endDate: "",
        duration: "",
        discount: "0",
        validUntilDays: "30",
        paymentTerms: "",
    });

    // حالات مودال حذف المشروع
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingProject, setDeletingProject] = useState(null);
    const [deleteConfirmationName, setDeleteConfirmationName] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // حساب السعر النهائي تلقائياً
    const subTotalNum = parseFloat(newProjectForm.subTotal) || 0;
    const profitNum = parseFloat(newProjectForm.profitPercentage) || 0;
    const calculatedTotal = (subTotalNum + (subTotalNum * profitNum) / 100).toFixed(2);

    useEffect(() => {
        loadProjects();
        fetchClientsData();
    }, [orgId]);

    // دالة جلب قائمة العملاء مباشرة باستخدام getClients
    const fetchClientsData = async () => {
        if (!orgId) return;
        setLoadingClients(true);
        try {
            const result = await getClients({}, orgId);
            if (result?.success) {
                setClients(result.data || []);
            }
        } catch (err) {
            console.error("Error loading clients:", err);
        } finally {
            setLoadingClients(false);
        }
    };

    const loadProjects = async () => {
        setLoading(true);
        const result = await getProjects(orgId);
        if (result?.success) {
            setProjects(result.data || []);
        }
        setLoading(false);
    };

    // Mutation لإضافة عميل جديد بكافة الحقول
    const addClientMutation = useMutation({
        mutationFn: (clientPayload) => createClient(orgId, clientPayload),
        onSuccess: (result) => {
            if (result?.success) {
                const createdClient = result.data || {};
                
                // تحديث قائمة العملاء المحلية في الحالة مباشرة
                setClients((prev) => [createdClient, ...prev]);
                
                // تحديد العميل الجديد فوراً في النموذج
                setNewProjectForm((prev) => ({
                    ...prev,
                    clientId: String(createdClient.id || ""),
                    clientName: createdClient.name || newClientData.name,
                    clientEmail: createdClient.email || createdClient.contact_info?.email || newClientData.email
                }));

                // إعادة ضبط واجهة إضافة العميل
                setIsAddingNewClient(false);
                setNewClientData({
                    name: "", 
                    type: "individual",
                    city_id: "",
                    industry_id: "",
                    phone: "",
                    email: "",
                    whatsapp: "",
                    facebook: "",
                    instagram: "",
                    website: "",
                    address: "",
                    notes: ""
                });
                setClientAddError("");
            } else {
                setClientAddError(result?.message || "Could not save client. Please check all fields.");
            }
        },
        onError: (err) => {
            setClientAddError("An error occurred while creating client.");
        }
    });

    const handleCreateInlineClient = (e) => {
        e.preventDefault();
        if (!newClientData.name.trim()) {
            setClientAddError("Client name is required.");
            return;
        }
        addClientMutation.mutate(newClientData);
    };


    const handleOpenCreateModal = () => {
        setEditingProject(null);
        setIsAddingNewClient(false);
        setCreateError("");
        setNewClientData({
            name: "", 
            type: "individual",
            city_id: "",
            industry_id: "",
            phone: "",
            email: "",
            whatsapp: "",
            facebook: "",
            instagram: "",
            website: "",
            address: "",
            notes: ""
        });
        setClientAddError("");
        setNewProjectForm({
            title: "",
            description: "",
            subTotal: "",
            profitPercentage: "20",
            clientId: "",
            clientName: "",
            clientEmail: "",
            status: "pending",
            deadline: "2026-12-31",
            startDate: "",
            endDate: "",
            duration: "",
            discount: "0",
            validUntilDays: "30",
            paymentTerms: ""
        });
        setIsCreateModalOpen(true);
    };

   const handleOpenEditModal = (project, e) => {
        e.stopPropagation();
        setEditingProject(project);
        setIsAddingNewClient(false);
        
        // استخراج القيم بأمان مع تغطية جميع مسارات البيانات المحتملة
        const subTotalVal = project.sub_total || project.current_version?.sub_total || (project.budget ? String(project.budget).replace(/[^0-9.]/g, '') : "") || "";
        const profitVal = project.profit_percentage || project.current_version?.profit_percentage || "20";

        setNewProjectForm({
            title: project.current_version?.title || project.title || "",
            description: project.current_version?.description || project.description || "",
            subTotal: subTotalVal,
            profitPercentage: String(profitVal).replace(/[^0-9.]/g, ''),
            clientId: String(project.client_id || project.client?.id || project.clientId || ""),
            clientName: project.client?.name || project.clientName || "",
            clientEmail: project.client?.email || project.client?.contact_info?.email || project.clientEmail || "",
            status: project.status || "pending",
            deadline: project.deadline || "2026-12-31",
            startDate: project.current_version?.start_date || project.start_date || project.startDate || "",
            endDate: project.current_version?.end_date || project.end_date || project.endDate || "",
            duration: project.current_version?.duration || project.duration || "",
            discount: project.discount || "0",
            validUntilDays: project.valid_until_days || "30",
            paymentTerms: project.payment_terms || "",
        });
        
        setIsCreateModalOpen(true);
    };

    const handleOpenDeleteModal = (project, e) => {
        e.stopPropagation();
        setDeletingProject(project);
        setDeleteConfirmationName("");
        setDeleteError("");
        setIsDeleteModalOpen(true);
    };

 
    const handleDeleteProject = async (e) => {
        e.preventDefault();
        if (!deletingProject) return;

        const targetName = deletingProject.current_version?.title || deletingProject.title || "";
        if (deleteConfirmationName !== targetName) return;

        setDeleting(true);
        setDeleteError("");

        try {
            const response = await deleteProject(orgId, deletingProject.id);
            if (response.success) {
                setProjects(projects.filter((p) => p.id !== deletingProject.id));
                setIsDeleteModalOpen(false);
                setDeletingProject(null);
                setDeleteConfirmationName("");
            } else {
                setDeleteError(response.message || "Failed to delete project");
            }
        } catch (err) {
            setDeleteError("An error occurred while deleting the project");
        } finally {
            setDeleting(false);
        }
    };
const resetProjectForm = () => {
    setNewProjectForm({
        title: "",
        description: "",
        subTotal: "",
        profitPercentage: "20",
        clientId: "",
        clientName: "",
        clientEmail: "",
        status: "pending",
        deadline: "2026-12-31",
        startDate: "",
        endDate: "",
        duration: "",
    });
};

   const handleSaveNewProject = async (e) => {
        e.preventDefault();
        setCreating(true);
        setCreateError("");

        try {
            // توحيد مفاتيح البيانات لتشمل camelCase و snake_case لتجنب رفض الباك-إند
            const formData = {
                title: newProjectForm.title,
                description: newProjectForm.description,
                status: newProjectForm.status,
                
                startDate: newProjectForm.startDate,
                start_date: newProjectForm.startDate,
                endDate: newProjectForm.endDate,
                end_date: newProjectForm.endDate,
                duration: newProjectForm.duration,
                
                subTotal: newProjectForm.subTotal,
                sub_total: parseFloat(newProjectForm.subTotal) || 0,
                profitPercentage: newProjectForm.profitPercentage,
                profit_percentage: parseFloat(newProjectForm.profitPercentage) || 0,
                totalAmount: calculatedTotal,
                total_amount: parseFloat(calculatedTotal) || 0,
                
                clientId: newProjectForm.clientId,
                client_id: newProjectForm.clientId,
                clientName: newProjectForm.clientName,
                clientEmail: newProjectForm.clientEmail,
                discount: parseFloat(newProjectForm.discount) || 0,
                valid_until_days: parseInt(newProjectForm.validUntilDays) || 30,
                payment_terms: newProjectForm.paymentTerms,
            };

            if (editingProject) {
                const response = await updateProject(orgId, editingProject.id, formData);

                if (response.success) {
                    const updatedData = response.data || {};
                    
                    // تحديث حالة الواجهة (State) بناءً على المدخلات لضمان تغيرها فوراً
                    setProjects(projects.map(p => p.id === editingProject.id ? {
                        ...p,
                        ...updatedData,
                        status: newProjectForm.status,
                        sub_total: newProjectForm.subTotal,
                        profit_percentage: newProjectForm.profitPercentage,
                        current_version: {
                            ...p.current_version,
                            ...(updatedData.current_version || {}),
                            title: newProjectForm.title,
                            description: newProjectForm.description,
                            start_date: newProjectForm.startDate,
                            end_date: newProjectForm.endDate,
                            duration: newProjectForm.duration,
                        },
                        client: {
                            ...p.client,
                            ...(updatedData.client || {}),
                            name: newProjectForm.clientName,
                            email: newProjectForm.clientEmail
                        },
                        title: newProjectForm.title,
                        description: newProjectForm.description,
                        clientName: newProjectForm.clientName,
                        clientEmail: newProjectForm.clientEmail,
                        budget: `$${Number(calculatedTotal).toLocaleString()}`,
                        total_amount: calculatedTotal,
                        formatted_total_amount: `$${Number(calculatedTotal).toLocaleString()}`,
                    } : p));
                    
                    setIsCreateModalOpen(false);
                    setEditingProject(null);
                    resetProjectForm();
                } else {
                    setCreateError(response.message || "Failed to update project");
                }
            } else {
                const response = await createProject(orgId, formData);

                if (response.success) {
                    const serverData = response.data || {};
                    const createdProject = {
                        id: serverData.id || Date.now(),
                        title: newProjectForm.title,
                        description: newProjectForm.description,
                        current_version: {
                            title: newProjectForm.title,
                            description: newProjectForm.description,
                            start_date: serverData.current_version?.start_date ?? newProjectForm.startDate,
                            end_date: serverData.current_version?.end_date ?? newProjectForm.endDate,
                            duration: serverData.current_version?.duration ?? newProjectForm.duration,
                        },
                        client: {
                            name: newProjectForm.clientName || serverData.client?.name || `Client #${newProjectForm.clientId}`,
                            email: newProjectForm.clientEmail || serverData.client?.email
                        },
                        clientName: newProjectForm.clientName || serverData.client?.name || `Client #${newProjectForm.clientId}`,
                        clientEmail: newProjectForm.clientEmail || serverData.client?.email,
                        client_id: newProjectForm.clientId,
                        sub_total: newProjectForm.subTotal,
                        profit_percentage: newProjectForm.profitPercentage,
                        status: newProjectForm.status,
                        budget: `$${Number(calculatedTotal).toLocaleString()}`,
                        total_amount: calculatedTotal,
                        formatted_total_amount: `$${Number(calculatedTotal).toLocaleString()}`,
                        deadline: newProjectForm.deadline,
                        attachmentsCount: 0,
                        submittedAt: new Date().toISOString().split('T')[0],
                        created_at: new Date().toISOString()
                    };
                    setProjects([createdProject, ...projects]);
                    setIsCreateModalOpen(false);
                    resetProjectForm();
                } else {
                    setCreateError(response.message || "Failed to create project");
                }
            }

        } catch (err) {
            setCreateError("Failed to save project");
        } finally {
            setCreating(false);
        }
    };
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const title = project.current_version?.title || project.title || "";
            const clientName = project.client?.name || project.clientName || "";
            
            const matchesSearch = 
                title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                clientName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || project.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: projects.length,
            inProgress: projects.filter(p => p.status === "in_progress").length,
            pending: projects.filter(p => p.status === "pending" || p.status === "under_review" || p.status === "new").length,
            completed: projects.filter(p => p.status === "completed").length,
        };
    }, [projects]);

    const currentProjectTitle = deletingProject
        ? deletingProject.current_version?.title || deletingProject.title || ""
        : "";

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="ltr">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
                        <span>Project Management</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Manage and track incoming client project requests.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
                    <button
                        onClick={loadProjects}
                        disabled={loading}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition border border-gray-200 shrink-0"
                        title="Refresh projects"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
                    </button>

                    {/* زر فتح مودال إضافة مشروع جديد */}
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">Create Project</span>
                    </button>
                </div>
            </div>

            {/* Stats Summary Bar */}
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Total Projects</p>
                        <h4 className="text-xl font-bold text-gray-900 mt-0.5">{stats.total}</h4>
                    </div>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                        <FolderKanban className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">In Progress</p>
                        <h4 className="text-xl font-bold text-amber-600 mt-0.5">{stats.inProgress}</h4>
                    </div>
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Pending Review</p>
                        <h4 className="text-xl font-bold text-purple-600 mt-0.5">{stats.pending}</h4>
                    </div>
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Completed</p>
                        <h4 className="text-xl font-bold text-emerald-600 mt-0.5">{stats.completed}</h4>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search project or client name..."
                        className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Tabs Container */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {[
                        { key: "all", label: "All Projects" },
                        { key: "new", label: "New" },
                        { key: "under_review", label: "Under Review" },
                        { key: "in_progress", label: "In Progress" },
                        { key: "completed", label: "Completed" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setStatusFilter(tab.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                                statusFilter === tab.key
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects View */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-xs text-gray-400 font-medium">Fetching project data...</span>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 sm:p-12 text-center space-y-3">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-sm font-semibold text-gray-700">No projects found</p>
                    <p className="text-xs text-gray-400">Try adjusting your search criteria or create a new project.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                    <th className="py-3.5 px-4">Project</th>
                                    <th className="py-3.5 px-4">Client</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Budget</th>
                                    <th className="py-3.5 px-4">Deadline</th>
                                    <th className="py-3.5 px-4 text-center">Files</th>
                                    <th className="py-3.5 px-4 text-right">Submitted</th>
                                    <th className="py-3.5 px-4 text-center">Actions</th>
                                    <th className="py-3.5 px-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs">
                                {filteredProjects.map((project) => (
                                    <ProjectTableRow 
                                        key={project.id} 
                                        project={project} 
                                        orgId={orgId} 
                                        onEdit={(e) => handleOpenEditModal(project, e)}
                                        onDelete={(e) => handleOpenDeleteModal(project, e)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List View */}
                    <div className="block md:hidden divide-y divide-gray-100">
                        {filteredProjects.map((project) => (
                            <ProjectMobileCard 
                                key={project.id} 
                                project={project} 
                                orgId={orgId} 
                                onEdit={(e) => handleOpenEditModal(project, e)}
                                onDelete={(e) => handleOpenDeleteModal(project, e)}
                            />
                        ))}
                    </div>

                </div>
            )}

            {/* 👇 استدعاء المكون الجديد هنا كبديل للمودال القديم */}
            {isCreateModalOpen && (
                <ProjectFormModal
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    editingProject={editingProject}
                    createError={createError}
                    newProjectForm={newProjectForm}
                    setNewProjectForm={setNewProjectForm}
                    handleSaveNewProject={handleSaveNewProject}
                    calculatedTotal={calculatedTotal}
                    creating={creating}
                    isAddingNewClient={isAddingNewClient}
                    setIsAddingNewClient={setIsAddingNewClient}
                    newClientData={newClientData}
                    setNewClientData={setNewClientData}
                    clients={clients}
                    loadingClients={loadingClients}
                    cities={cities}
                    industries={industries}
                    loadingLookups={loadingLookups}
                    clientAddError={clientAddError}
                    setClientAddError={setClientAddError}
                    handleCreateInlineClient={handleCreateInlineClient}
                    isClientPending={addClientMutation.isPending}
                />
            )}

            {/* Modal: Delete Project Confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 mx-2">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                                <Trash2 className="w-5 h-5 shrink-0" />
                                <span>Delete Project</span>
                            </h3>
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {deleteError && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs text-center font-medium">
                                {deleteError}
                            </div>
                        )}

                        <div className="space-y-3">
                            <p className="text-xs text-gray-600">
                                Are you sure you want to delete project <span className="font-bold text-gray-900">{currentProjectTitle}</span>? This action cannot be undone.
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Type <span className="font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">{currentProjectTitle}</span> to confirm:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmationName}
                                    onChange={(e) => setDeleteConfirmationName(e.target.value)}
                                    placeholder="Enter project name..."
                                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteProject}
                                disabled={deleting || deleteConfirmationName !== currentProjectTitle}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                <span>Delete Project</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// مكون الصف لسطح المكتب
function ProjectTableRow({ project, orgId, onEdit, onDelete }) {
    const router = useRouter();

    const statusBadges = {
        new: { label: "New", className: "bg-blue-50 text-blue-700 border-blue-200" },
        under_review: { label: "Under Review", className: "bg-purple-50 text-purple-700 border-purple-200" },
        in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700 border-amber-200" },
        pending: { label: "Pending", className: "bg-purple-50 text-purple-700 border-purple-200" },
        completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        cancelled: { label: "Cancelled", className: "bg-gray-50 text-gray-600 border-gray-200" },
    };

    const statusInfo = statusBadges[project.status] || statusBadges.new;

    const handleRowClick = () => {
        router.push(`/${orgId}/dashboard/projects/${project.id}`);
    };
   const getFormattedBudget = () => {
        const rawBudget = project.formatted_total_amount || project.total_amount || project.budget || project.current_version?.total_amount || project.sub_total || 0;
        
        // إذا كانت القيمة كنص وتحتوي مسبقاً على $، نعرضها كما هي
        if (typeof rawBudget === 'string' && rawBudget.includes('$')) return rawBudget;
        
        // استخراج الأرقام فقط وتنسيقها
        const numericValue = parseFloat(String(rawBudget).replace(/[^0-9.]/g, '')) || 0;
        return `$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    const displayBudget = getFormattedBudget();

    // 👇 2. تنسيق التاريخ ليظهر بشكل قصير وأنيق (YYYY-MM-DD)
    const rawDeadline = project.current_version?.end_date || project.end_date || project.deadline;
    const displayDeadline = rawDeadline ? String(rawDeadline).split('T')[0] : "-";

    // 👇 3. عدد الملفات
    const displayFilesCount = project.attachments_count || project.attachmentsCount || project.attachments?.length || 0;
    return (
        <tr onClick={handleRowClick} className="hover:bg-blue-50/40 transition-colors cursor-pointer group">
            <td className="py-4 px-4 max-w-xs">
                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {project.current_version?.title || project.title}
                </p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {project.reference_id || `#${project.id}`}
                </p>
            </td>

            <td className="py-4 px-4 whitespace-nowrap">
                <p className="font-semibold text-gray-700">{project.client?.name || project.clientName}</p>
                <p className="text-[11px] text-gray-400">{project.client?.email || project.client?.contact_info?.email || project.clientEmail}</p>
            </td>

            <td className="py-4 px-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.className}`}>
                    {statusInfo.label}
                </span>
            </td>

            <td className="py-4 px-4 font-bold text-gray-800 whitespace-nowrap">
                {displayBudget}
            </td>

            <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                {displayDeadline}
            </td>

            <td className="py-4 px-4 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md text-[11px] font-medium">
                    <Paperclip className="w-3 h-3 text-gray-400" />
                    {displayFilesCount}
                </span>
            </td>

            <td className="py-4 px-4 text-right text-gray-400 whitespace-nowrap text-[11px]">
                {project.created_at ? new Date(project.created_at).toISOString().split('T')[0] : project.submittedAt}
            </td>

            <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-1">
                    <button
                        onClick={onEdit}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="Edit Project"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete Project"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>

            <td className="py-4 px-4 text-right">
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors inline-block" />
            </td>
        </tr>
    );
}

// مكون البطاقة للهواتف
function ProjectMobileCard({ project, orgId, onEdit, onDelete }) {
    const router = useRouter();

    const statusBadges = {
        new: { label: "New", className: "bg-blue-50 text-blue-700 border-blue-200" },
        under_review: { label: "Under Review", className: "bg-purple-50 text-purple-700 border-purple-200" },
        in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700 border-amber-200" },
        pending: { label: "Pending", className: "bg-purple-50 text-purple-700 border-purple-200" },
        completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        cancelled: { label: "Cancelled", className: "bg-gray-50 text-gray-600 border-gray-200" },
    };

    const statusInfo = statusBadges[project.status] || statusBadges.new;

    const handleCardClick = () => {
        router.push(`/${orgId}/dashboard/projects/${project.id}`);
    };
const getFormattedBudget = () => {
        const rawBudget = project.formatted_total_amount || project.total_amount || project.budget || project.current_version?.total_amount || project.sub_total || 0;
        if (typeof rawBudget === 'string' && rawBudget.includes('$')) return rawBudget;
        const numericValue = parseFloat(String(rawBudget).replace(/[^0-9.]/g, '')) || 0;
        return `$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    const displayBudget = getFormattedBudget();

    const displayFilesCount = project.attachments_count || project.attachmentsCount || project.attachments?.length || 0;
    return (
        <div 
            onClick={handleCardClick}
            className="p-4 hover:bg-blue-50/30 transition-colors cursor-pointer space-y-3 active:bg-blue-50/50"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate">
                        {project.current_version?.title || project.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1">
                        {project.current_version?.description || project.description}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(e);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Project"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(e);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Project"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                </div>
            </div>

            <div className="flex items-center justify-between pt-1">
                <div>
                    <p className="text-xs font-semibold text-gray-700">
                        {project.client?.name || project.clientName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                        {project.client?.email || project.client?.contact_info?.email || project.clientEmail}
                    </p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusInfo.className}`}>
                    {statusInfo.label}
                </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-50 text-gray-500">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">
                        {displayBudget}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                        <Paperclip className="w-3 h-3 text-gray-400" />
                        {displayFilesCount}
                    </span>
                </div>
                <span className="text-[10px] text-gray-400">
                    {project.created_at ? new Date(project.created_at).toISOString().split('T')[0] : project.submittedAt}
                </span>
            </div>
        </div>
    );
}