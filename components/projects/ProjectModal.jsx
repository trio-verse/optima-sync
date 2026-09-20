"use client";

import {
    FolderKanban,
    X,
    Calendar,
    Hourglass,
    UserPlus,
    User,
    Building2,
    MapPin,
    Briefcase,
    Phone,
    Mail,
    MessageSquare,
    Globe,
    Share2,
    Check,
    Loader2
} from "lucide-react";

export default function ProjectFormModal({
    setIsCreateModalOpen,
    editingProject,
    createError,
    newProjectForm,
    setNewProjectForm,
    handleSaveNewProject,
    calculatedTotal,
    creating,
    isAddingNewClient,
    setIsAddingNewClient,
    newClientData,
    setNewClientData,
    clients,
    loadingClients,
    cities,
    industries,
    loadingLookups,
    clientAddError,
    setClientAddError,
    handleCreateInlineClient,
    isClientPending
}) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 mx-2 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 text-blue-600 shrink-0" />
                        <span>{editingProject ? "Edit Project" : "Create New Project"}</span>
                    </h3>
                    <button 
                        onClick={() => setIsCreateModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {createError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs text-center font-medium">
                        {createError}
                    </div>
                )}

                <form onSubmit={handleSaveNewProject} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Project Title</label>
                        <input
                            type="text"
                            required
                            value={newProjectForm.title}
                            onChange={(e) => setNewProjectForm({...newProjectForm, title: e.target.value})}
                            placeholder="e.g. Warehouse Operations Portal"
                            className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={2}
                            value={newProjectForm.description}
                            onChange={(e) => setNewProjectForm({...newProjectForm, description: e.target.value})}
                            placeholder="Brief overview of project scope..."
                            className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                        />
                    </div>

                    {/* Start Date / End Date / Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-blue-600" />
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={newProjectForm.startDate}
                                onChange={(e) => setNewProjectForm({...newProjectForm, startDate: e.target.value})}
                                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-blue-600" />
                                End Date
                            </label>
                            <input
                                type="date"
                                value={newProjectForm.endDate}
                                onChange={(e) => setNewProjectForm({...newProjectForm, endDate: e.target.value})}
                                min={newProjectForm.startDate || undefined}
                                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                                <Hourglass className="w-3 h-3 text-blue-600" />
                                Duration
                            </label>
                            <input
                                type="text"
                                value={newProjectForm.duration}
                                onChange={(e) => setNewProjectForm({...newProjectForm, duration: e.target.value})}
                                placeholder="e.g. 2 months"
                                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* القائمة المنسدلة لاختيار العميل أو إضافة عميل جديد */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Select Client</label>
                        <select
                            required
                            value={isAddingNewClient ? "ADD_NEW" : newProjectForm.clientId}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === "ADD_NEW") {
                                    setIsAddingNewClient(true);
                                } else {
                                    setIsAddingNewClient(false);
                                    const selectedClient = clients.find((c) => String(c.id) === val);
                                    setNewProjectForm({
                                        ...newProjectForm,
                                        clientId: val,
                                        clientName: selectedClient?.name || "",
                                        clientEmail: selectedClient?.email || selectedClient?.contact_info?.email || ""
                                    });
                                }
                            }}
                            disabled={loadingClients}
                            className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 text-gray-700 font-medium"
                        >
                            <option value="">{loadingClients ? "Loading clients..." : "-- Select Existing Client --"}</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.name} {client.email || client.contact_info?.email ? `(${client.email || client.contact_info?.email})` : ''}
                                </option>
                            ))}
                            <option value="ADD_NEW" className="font-bold text-blue-600 bg-blue-50">
                                + Add New Client...
                            </option>
                        </select>
                    </div>

                    {/* نموذج فرعي مدمج كامل وبكل الحقول المطلوبة (Inline Client Creation Form) */}
                    {isAddingNewClient && (
                        <div className="bg-gradient-to-b from-blue-50/70 to-slate-50 border border-blue-200/80 p-4 rounded-2xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs">
                                        <UserPlus className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Add New Client (Full Form)</h4>
                                        <p className="text-[10px] text-gray-500">Provide complete information to avoid validation failure</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingNewClient(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Client Name */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <User className="w-3 h-3 text-blue-600" />
                                        Client Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newClientData.name}
                                        onChange={(e) => {
                                            setNewClientData({ ...newClientData, name: e.target.value });
                                            if (clientAddError) setClientAddError("");
                                        }}
                                        placeholder="e.g. John Doe / Tech Corp"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                {/* Client Type */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <Building2 className="w-3 h-3 text-blue-600" />
                                        Client Type
                                    </label>
                                    <select
                                        value={newClientData.type}
                                        onChange={(e) => setNewClientData({ ...newClientData, type: e.target.value })}
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="individual">Individual</option>
                                        <option value="company">Company</option>
                                        <option value="government">Government</option>
                                        <option value="agency">Agency</option>
                                        <option value="charity">Charity</option>
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-blue-600" />
                                        City
                                    </label>
                                    <select
                                        value={newClientData.city_id}
                                        onChange={(e) => setNewClientData({ ...newClientData, city_id: e.target.value })}
                                        disabled={loadingLookups}
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="">Select city...</option>
                                        {cities?.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Industry */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <Briefcase className="w-3 h-3 text-blue-600" />
                                        Industry
                                    </label>
                                    <select
                                        value={newClientData.industry_id}
                                        onChange={(e) => setNewClientData({ ...newClientData, industry_id: e.target.value })}
                                        disabled={loadingLookups}
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="">Select industry...</option>
                                        {industries?.map((ind) => (
                                            <option key={ind.id} value={ind.id}>{ind.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-blue-600" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={newClientData.phone}
                                        onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                                        placeholder="e.g. +1 234 567 890"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-blue-600" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={newClientData.email}
                                        onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                                        placeholder="e.g. client@example.com"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                {/* WhatsApp */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3 text-blue-600" />
                                        WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={newClientData.whatsapp}
                                        onChange={(e) => setNewClientData({ ...newClientData, whatsapp: e.target.value })}
                                        placeholder="e.g. +1 234 567 890"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <Globe className="w-3 h-3 text-blue-600" />
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={newClientData.website}
                                        onChange={(e) => setNewClientData({ ...newClientData, website: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                {/* Social Links (Facebook & Instagram) */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <Share2 className="w-3 h-3 text-blue-600" />
                                        Facebook
                                    </label>
                                    <input
                                        type="text"
                                        value={newClientData.facebook}
                                        onChange={(e) => setNewClientData({ ...newClientData, facebook: e.target.value })}
                                        placeholder="Facebook Profile / Page URL"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <Share2 className="w-3 h-3 text-blue-600" />
                                        Instagram
                                    </label>
                                    <input
                                        type="text"
                                        value={newClientData.instagram}
                                        onChange={(e) => setNewClientData({ ...newClientData, instagram: e.target.value })}
                                        placeholder="Instagram Handle / Profile URL"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1">Address Details</label>
                                <textarea
                                    rows={2}
                                    value={newClientData.address}
                                    onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                                    placeholder="Street details, building number..."
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1">Notes</label>
                                <textarea
                                    rows={2}
                                    value={newClientData.notes}
                                    onChange={(e) => setNewClientData({ ...newClientData, notes: e.target.value })}
                                    placeholder="Additional internal notes..."
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                />
                            </div>

                            {clientAddError && (
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg text-[11px] text-center font-medium">
                                    {clientAddError}
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-1 border-t border-blue-100/60">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingNewClient(false)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs rounded-xl transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateInlineClient}
                                    disabled={isClientPending}
                                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                    {isClientPending ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Check className="w-3.5 h-3.5" />
                                    )}
                                    <span>{isClientPending ? "Saving..." : "Save Client"}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* عرض تفاصيل العميل المختار */}
                    {!isAddingNewClient && newProjectForm.clientId && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Client Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={newProjectForm.clientName}
                                    className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none cursor-default"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Client Email</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={newProjectForm.clientEmail || "-"}
                                    className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none cursor-default"
                                />
                            </div>
                        </div>
                    )}

                    {/* حالة المشروع */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Initial Status</label>
                        <select
                            value={newProjectForm.status}
                            onChange={(e) => setNewProjectForm({...newProjectForm, status: e.target.value})}
                            className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 text-gray-700 font-medium"
                        >
                            <option value="new">New</option>
                            <option value="under_review">Under Review</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Sub Total ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={newProjectForm.subTotal}
                                onChange={(e) => setNewProjectForm({...newProjectForm, subTotal: e.target.value})}
                                placeholder="10000.00"
                                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Profit Percentage (%)</label>
                            <input
                                type="number"
                                required
                                value={newProjectForm.profitPercentage}
                                onChange={(e) => setNewProjectForm({...newProjectForm, profitPercentage: e.target.value})}
                                placeholder="20"
                                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    {/* إعدادات عرض السعر (Quotation Settings) */}
<div className="pt-4 border-t border-gray-100">
    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Quotation Settings</h4>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Discount ($)</label>
            <input
                type="number"
                min="0"
                step="0.01"
                value={newProjectForm.discount}
                onChange={(e) => setNewProjectForm({...newProjectForm, discount: e.target.value})}
                placeholder="0.00"
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Valid Until (Days)</label>
            <input
                type="number"
                min="1"
                value={newProjectForm.validUntilDays}
                onChange={(e) => setNewProjectForm({...newProjectForm, validUntilDays: e.target.value})}
                placeholder="e.g. 30"
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Payment Terms</label>
            <input
                type="text"
                value={newProjectForm.paymentTerms}
                onChange={(e) => setNewProjectForm({...newProjectForm, paymentTerms: e.target.value})}
                placeholder="e.g. 50% upfront, 50% on delivery"
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
            />
        </div>
    </div>
</div>
                    {/* السعر النهائي المحسوب تلقائياً */}
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Calculated Total Amount:</span>
                        <span className="text-sm font-bold text-blue-600">${calculatedTotal}</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creating || isAddingNewClient}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{editingProject ? "Update Project" : "Save Project"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}