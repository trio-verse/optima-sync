"use client";
import {
  getMembers,
  createMember,
  deleteMember,
  updateMember,
} from "@/actions/services/membersAction";
import {
  Users,
  Sparkles,
  Plus,
  UserCheck,
  ShieldCheck,
  Search,
  Trash2,
  Mail,
  Pencil,
  X,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ email: "", role: "member" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingRole, setEditingRole] = useState("member");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError("");
      try {
        const result = await getMembers();
        if (result?.success) {
          setMembers(result?.data || []);
        } else {
          console.error("Fetch members backend error:", result?.message);
          setError(
            "Unable to load team members. Please try refreshing the page.",
          );
        }
      } catch (err) {
        console.error("Fetch error details:", err);
        setError("A connection error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const validateForm = () => {
    setError("");
    const validRoles = ["member", "admin"];

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return false;
    }

    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!formData.role || !validRoles.includes(formData.role)) {
      setError("Please select a valid role.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    try {
      const result = await createMember(formData);
      if (result?.success) {
        setMembers((prev) => [result.data, ...prev]);
        setFormData({ email: "", role: "member" });
        setError("");
      } else {
        console.error("Create member backend error:", result?.message);
        setError("Failed to add new member. Please try again.");
      }
    } catch (err) {
      console.error("Create member error details:", err);
      setError("An unexpected error occurred while adding the member.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (member) => {
    setError("");
    setEditingId(member.id);
    setEditingRole(member.role);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await updateMember(editingId, { role: editingRole });

      if (result?.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === editingId ? { ...m, role: editingRole } : m,
          ),
        );
        setIsModalOpen(false);
        setEditingId(null);
      } else {
        console.error("Update member backend error:", result?.message);
        setError("Failed to update member role. Please try again.");
      }
    } catch (err) {
      console.error("Update member error details:", err);
      setError("An unexpected error occurred while updating the role.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    setLoading(true);
    setError("");
    try {
      const result = await deleteMember(id);
      if (result?.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        console.error("Delete member backend error:", result?.message);
        setError("Failed to delete member. Please try again.");
      }
    } catch (err) {
      console.error("Delete member error details:", err);
      setError("An unexpected error occurred while removing the member.");
    } finally {
      setLoading(false);
    }
  };

  const getNameFromEmail = (email) => {
    if (!email) return "";
    return email.split("@")[0];
  };

  const filteredMembers = members.filter((member) => {
    const name = getNameFromEmail(member.email).toLowerCase();
    const email = (member.email || "").toLowerCase();
    const role = (member.role || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      name.includes(search) || email.includes(search) || role.includes(search)
    );
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "member":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Team Members
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                Manage team members, roles, and access permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Members
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {members.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Account Access
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active & Verified
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Role Management
              </p>
              <h3 className="text-sm font-bold text-slate-700 mt-2">
                Role-Based Access
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Add New Member
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Enter member email and select their role.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-2.5 text-red-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-6 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (error) setError("");
                }}
                placeholder="example@company.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="md:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save member"}
              </button>
            </div>
          </form>
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search members by email or role..."
            className="w-full bg-white border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
          />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => {
                    const memberName = getNameFromEmail(member.email);

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase border border-indigo-100">
                              {memberName.charAt(0)}
                            </div>
                            <span className="capitalize">{memberName}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>{member.email}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold capitalize border ${getRoleBadge(member.role)}`}
                          >
                            {member.role}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(member)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                            title="Edit Role"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-slate-400 font-medium"
                    >
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-100 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900">
                Update Member Role
              </h3>

              <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role
                  </label>
                  <select
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading}
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
