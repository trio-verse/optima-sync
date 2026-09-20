"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Check,
  Loader2,
  Link2,
  User,
  ArrowRightLeft,
  Tag,
  Package,
  AlertTriangle,
  DollarSign,
  Megaphone,
  UserCheck,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  createConnection,
  updateConnection,
} from "@/actions/connectionActions";
import { createClient } from "@/actions/clientActions";
import { useConnectionSelects } from "@/hooks/useConnectionSelects";
import { useClientLookups } from "@/hooks/useClientLookups";

const CLIENT_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
  { value: "government", label: "Government" },
  { value: "charity", label: "Charity" },
  { value: "agency", label: "Agency" },
];

export default function ConnectionModal({
  clientId: initialClientId,
  orgId,
  isOpen,
  onClose,
  onSuccess,
  editingConnection = null,
}) {
  const queryClient = useQueryClient();

  const {
    products,
    channels,
    members,
    campaigns,
    clients,
    isLoading: loadingLists,
  } = useConnectionSelects(orgId, isOpen);

  const { cities, industries, loadingLookups } = useClientLookups(orgId);

  // التحكم بالخطوات (Step 1: Client Selection, Step 2: Connection Form)
  const [step, setStep] = useState(1);

  const [isNewClient, setIsNewClient] = useState(false);
  const [searchName, setSearchName] = useState("");

  // Connection Form State
  const [formData, setFormData] = useState({
    clientId: initialClientId || "",
    productId: "",
    stage: "lead",
    channelId: "",
    assigneeId: "",
    campaignId: "",
    dealValue: "",
    initiatedBy: "",
  });

  // Simplified New Client State
  const [newClientData, setNewClientData] = useState({
    name: "",
    type: "individual",
    phone: "",
    city_id: "",
    industry_id: "",
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const isEditing = !!editingConnection;

  // فلترة قائمة العملاء بناءً على حقل البحث
  const filteredClients = clients.filter((c) => {
    const name = c.name || c.full_name || "";
    return name.toLowerCase().includes(searchName.toLowerCase());
  });

  const handleBackendErrors = (result) => {
    if (result?.errors) {
      const map = {
        client_id: "clientId",
        product_id: "productId",
        channel_id: "channelId",
        campaign_id: "campaignId",
        assignee_id: "assigneeId",
        initiated_by: "initiatedBy",
        deal_value: "dealValue",
        name: "client_name",
        phone: "client_phone",
        type: "client_type",
        industry_id: "client_industry_id",
        city_id: "client_city_id",
      };
      const be = {};
      Object.entries(result.errors).forEach(([k, v]) => {
        be[map[k] || k] = Array.isArray(v) ? v[0] : v;
      });
      setErrors(be);
    } else {
      setGlobalError(result?.message || "An error occurred while saving");
    }
  };

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      let activeClientId = initialClientId || data.clientId;

      if (!initialClientId && isNewClient) {
        const clientRes = await createClient(newClientData, orgId);
        if (!clientRes?.success) {
          throw clientRes;
        }
        activeClientId = clientRes.data?.id;
      }

      let result;
      if (isEditing) {
        result = await updateConnection(
          editingConnection.id,
          data,
          orgId,
          activeClientId,
        );
      } else {
        result = await createConnection(activeClientId, data, orgId);
      }

      if (!result?.success) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["clients", orgId] });

      setErrors({});
      setGlobalError("");

      onSuccess?.(result.data);
      onClose();
    },
    onError: (err) => {
      handleBackendErrors(err);
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (editingConnection) {
      setFormData({
        clientId: String(
          editingConnection.client_id ||
            editingConnection.client?.id ||
            initialClientId ||
            "",
        ),
        productId: String(
          editingConnection.product_id || editingConnection.productId || "",
        ),
        stage: editingConnection.stage || "lead",
        channelId: String(
          editingConnection.channel_id || editingConnection.channelId || "",
        ),
        assigneeId:
          editingConnection.assignee_id || editingConnection.assigneeId || "",
        campaignId: String(
          editingConnection.campaign_id || editingConnection.campaignId || "",
        ),
        dealValue:
          editingConnection.deal_value || editingConnection.dealValue || "",
        initiatedBy:
          editingConnection.initiated_by || editingConnection.initiatedBy || "",
      });
      setStep(2); // الانتقال المباشر للخطوة الثانية عند التعديل
    } else if (initialClientId) {
      setFormData({
        clientId: initialClientId,
        productId: "",
        stage: "lead",
        channelId: "",
        assigneeId: "",
        campaignId: "",
        dealValue: "",
        initiatedBy: "",
      });
      setStep(2); // الانتقال المباشر للخطوة الثانية إذا كان العميل محدد مسبقاً
    } else {
      setFormData({
        clientId: "",
        productId: "",
        stage: "lead",
        channelId: "",
        assigneeId: "",
        campaignId: "",
        dealValue: "",
        initiatedBy: "",
      });
      setStep(1);
    }

    setIsNewClient(false);
    setSearchName("");
    setNewClientData({
      name: "",
      type: "individual",
      phone: "",
      city_id: "",
      industry_id: "",
    });
    setErrors({});
    setGlobalError("");
  }, [isOpen, editingConnection, initialClientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "productId") {
        const selectedProd = products.find(
          (p) => String(p.id) === String(value),
        );
        updated.dealValue = selectedProd?.price || selectedProd?.value || "";
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClientData((prev) => ({ ...prev, [name]: value }));
    if (errors[`client_${name}`]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[`client_${name}`];
        return n;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (isNewClient) {
      if (!newClientData.name.trim())
        newErrors.client_name = "Client Name is required";
      if (!newClientData.city_id) newErrors.client_city_id = "City is required";
      if (!newClientData.industry_id)
        newErrors.client_industry_id = "Industry is required";
    } else {
      if (!formData.clientId) newErrors.clientId = "Please select a client";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
   
    const newErrors = {};
    if (!formData.productId) newErrors.productId = "Product is required";
    if (!formData.channelId) newErrors.channelId = "Channel is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setGlobalError("");
    submitMutation.mutate(formData);
  };

  if (!isOpen) return null;

  const isWonStage =
    String(formData.stage).toLowerCase() === "win" ||
    String(formData.stage).toLowerCase() === "won";

  const selectedClientObject = clients.find(
    (c) => String(c.id) === String(formData.clientId),
  );
  const handleClose = () => {
    setErrors({});
    setGlobalError("");
    setSearchName("");
    setIsNewClient(false);

    onClose();
  };
 
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150 border border-slate-100"
        dir="ltr"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {isEditing ? "Edit Connection" : "New Connection"}
                </h2>
                {!initialClientId && !isEditing && (
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 text-[11px] font-semibold">
                    {/* Step 1 */}
                    <span
                      className={`px-2.5 py-1 rounded-md transition-all duration-200 ${
                        step === 1
                          ? "bg-blue-600 text-white shadow-xs font-bold"
                          : "text-slate-400 font-medium"
                      }`}
                    >
                      Step 1
                    </span>

                    {/* Step 2 */}
                    <span
                      className={`px-2.5 py-1 rounded-md transition-all duration-200 ${
                        step === 2
                          ? "bg-blue-600 text-white shadow-xs font-bold"
                          : "text-slate-400 font-medium"
                      }`}
                    >
                      Step 2
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {step === 1
                  ? "Select or create a client"
                  : "Fill in connection details"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto pr-1 my-4 flex flex-col gap-4">
          {/* Step 1: Client Selection / Creation */}
          {step === 1 && !initialClientId && !isEditing && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1">
                {/* أزرار التبديل على اليسار */}
                <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewClient(false);
                      setErrors({});
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      !isNewClient
                        ? "bg-white text-slate-800 shadow-xs"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Select Existing
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsNewClient(true);
                      setErrors({});
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                      isNewClient
                        ? "bg-white text-blue-600 shadow-xs"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>New Client</span>
                  </button>
                </div>
              </div>
              {!isNewClient ? (
                /* Expanded Client Table Selection */
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Search client by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                  />

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-[280px] min-h-[200px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100/80 text-slate-600 font-semibold sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5 pl-3">Select</th>
                          <th className="p-2.5">Client Name</th>
                          <th className="p-2.5">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loadingLists ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="p-4 text-center text-slate-400"
                            >
                              Loading clients...
                            </td>
                          </tr>
                        ) : filteredClients.length > 0 ? (
                          filteredClients.map((c) => {
                            const isSelected =
                              String(formData.clientId) === String(c.id);
                            const clientName =
                              c.name || c.full_name || `Client #${c.id}`;
                            return (
                              <tr
                                key={c.id}
                                onClick={() =>
                                  handleChange({
                                    target: { name: "clientId", value: c.id },
                                  })
                                }
                                className={`cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-blue-50/80 font-medium"
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                <td className="p-2.5 pl-3 w-10">
                                  <input
                                    type="radio"
                                    name="clientIdRadio"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleChange({
                                        target: {
                                          name: "clientId",
                                          value: c.id,
                                        },
                                      })
                                    }
                                    className="h-3.5 w-3.5 text-blue-600 cursor-pointer"
                                  />
                                </td>
                                <td className="p-2.5 text-slate-800 font-medium truncate max-w-[180px]">
                                  {clientName}
                                </td>
                                <td className="p-2.5 text-slate-500 capitalize">
                                  {c.type || c.client_type || "-"}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="p-4 text-center text-slate-400"
                            >
                              No matching clients found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {errors.clientId && (
                    <span className="text-red-500 text-xs font-medium">
                      {errors.clientId}
                    </span>
                  )}
                </div>
              ) : (
                /* New Client Form */
                <div className="flex flex-col gap-3 pt-1 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newClientData.name}
                        onChange={handleNewClientChange}
                        placeholder="Enter client name..."
                        className={`border rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white ${
                          errors.client_name
                            ? "border-red-300 bg-red-50/30"
                            : "border-slate-200"
                        }`}
                      />
                      {errors.client_name && (
                        <span className="text-red-500 text-[10px] font-medium">
                          {errors.client_name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Client Type
                      </label>
                      <select
                        name="type"
                        value={newClientData.type}
                        onChange={handleNewClientChange}
                        className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white"
                      >
                        {CLIENT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={newClientData.phone}
                      onChange={handleNewClientChange}
                      dir="ltr"
                      placeholder="e.g. +123456789"
                      className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* City Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="city_id"
                        value={newClientData.city_id}
                        onChange={handleNewClientChange}
                        disabled={loadingLookups}
                        className={`border rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white disabled:opacity-50 ${
                          errors.client_city_id
                            ? "border-red-300 bg-red-50/30"
                            : "border-slate-200"
                        }`}
                      >
                        <option value="">Select City...</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.client_city_id && (
                        <span className="text-red-500 text-[10px] font-medium">
                          {errors.client_city_id}
                        </span>
                      )}
                    </div>

                    {/* Industry Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="industry_id"
                        value={newClientData.industry_id}
                        onChange={handleNewClientChange}
                        disabled={loadingLookups}
                        className={`border rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white disabled:opacity-50 ${
                          errors.client_industry_id
                            ? "border-red-300 bg-red-50/30"
                            : "border-slate-200"
                        }`}
                      >
                        <option value="">Select Industry...</option>
                        {industries.map((ind) => (
                          <option key={ind.id} value={ind.id}>
                            {ind.name}
                          </option>
                        ))}
                      </select>
                      {errors.client_industry_id && (
                        <span className="text-red-500 text-[10px] font-medium">
                          {errors.client_industry_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Connection Details */}
          {step === 2 && (
            <form
              id="connection-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 animate-in fade-in duration-150"
            >
              {/* Selected Client Summary Card (when on Step 2 and created/selected from step 1) */}
              {!initialClientId && !isEditing && (
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        Selected Client
                      </span>
                      <p className="text-xs font-bold text-slate-800">
                        {isNewClient
                          ? newClientData.name || "New Client"
                          : selectedClientObject?.name ||
                            selectedClientObject?.full_name ||
                            `Client #${formData.clientId}`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-blue-600 hover:underline font-bold px-2 py-1"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Product */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  Product <span className="text-red-500">*</span>
                </label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  disabled={loadingLists}
                  className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 transition-all bg-white ${
                    errors.productId
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <span className="text-red-500 text-xs font-medium">
                    {errors.productId}
                  </span>
                )}
              </div>

              {/* Deal Value */}
              {isWonStage && (
                <div className="flex flex-col gap-1.5 animate-in fade-in duration-150">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    Deal Value
                  </label>
                  <input
                    type="number"
                    name="dealValue"
                    value={formData.dealValue}
                    readOnly
                    placeholder="Product price"
                    className="border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed select-none font-semibold"
                  />
                </div>
              )}

              {/* Channel */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Channel <span className="text-red-500">*</span>
                </label>
                <select
                  name="channelId"
                  value={formData.channelId}
                  onChange={handleChange}
                  disabled={loadingLists}
                  className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 transition-all bg-white ${
                    errors.channelId
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                >
                  <option value="">Select channel...</option>
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.channelId && (
                  <span className="text-red-500 text-xs font-medium">
                    {errors.channelId}
                  </span>
                )}
              </div>

              {/* Campaign */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Megaphone className="w-3.5 h-3.5 text-slate-400" />
                  Campaign
                </label>
                <select
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleChange}
                  disabled={loadingLists}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                >
                  <option value="">Select campaign...</option>
                  {campaigns.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.name || camp.title || `Campaign #${camp.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Assignee
                </label>
                <select
                  name="assigneeId"
                  value={formData.assigneeId}
                  onChange={handleChange}
                  disabled={loadingLists}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                >
                  <option value="">Select assignee...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.user?.name || m.user?.full_name || m.user?.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Initiated By */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                  Initiated By
                </label>
                <input
                  type="text"
                  name="initiatedBy"
                  value={formData.initiatedBy || ""}
                  onChange={handleChange}
                  placeholder="Enter who initiated this..."
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                />
              </div>

              {/* Global Error */}
              {globalError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  {globalError}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
          {step === 2 && !initialClientId && !isEditing ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          )}

          <div className="flex items-center gap-2">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                {submitMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 stroke-[3]" />
                )}
                <span>
                  {submitMutation.isPending
                    ? "Saving..."
                    : isEditing
                      ? "Update"
                      : "Save Connection"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
