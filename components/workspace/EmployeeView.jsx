"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { createEmployee, getEmployees } from "@/actions/employees";
import EmployeeForm from "./EmployeeForm";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function EmployeeDetails({ employee }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      <div><p className="text-xs text-gray-400">Email</p><p className="truncate text-gray-700">{employee.email || "-"}</p></div>
      <div><p className="text-xs text-gray-400">Phone</p><p className="text-gray-700">{employee.phone || "-"}</p></div>
      <div><p className="text-xs text-gray-400">Cost Per Hour</p><p className="text-gray-700">{employee.cost_per_hour || "-"}</p></div>
      <div><p className="text-xs text-gray-400">Hours Per Point</p><p className="text-gray-700">{employee.houres_per_point || "-"}</p></div>
    </div>
  );
}

export default function EmployeeView({ orgId }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    if (!orgId) return;
    setLoading(true);
    setError("");
    try {
      const result = await getEmployees(orgId);
      if (result?.success) setEmployees(result.data || []);
      else setError(result?.message || "Unable to load employees. Please try again.");
    } catch {
      setError("Unable to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, [orgId]);

  const handleCreate = async (formData, resetForm) => {
    setIsSubmitting(true);
    setError("");
    const result = await createEmployee(formData, orgId);
    if (result?.success) {
      setEmployees((current) => [result.data, ...current]);
      resetForm();
      setIsFormOpen(false);
    } else {
      setError(result?.message || "Unable to create employee. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-5" dir="ltr">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Employees</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the people who work with your organization.</p>
        </div>
        <button onClick={() => { setError(""); setIsFormOpen(true); }} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto">
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      {error && !isFormOpen && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 h-4 w-32 rounded bg-gray-200" />
          <div className="h-12 w-full rounded bg-gray-100" />
          <div className="mt-2 h-12 w-full rounded bg-gray-100" />
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center shadow-sm">
          <Users className="mx-auto h-9 w-9 text-gray-400" />
          <h2 className="mt-3 text-base font-semibold text-gray-900">No employees yet</h2>
          <p className="mt-1 text-sm text-gray-500">Add your first employee to get started.</p>
          <button onClick={() => setIsFormOpen(true)} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Add Employee</button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                <tr>{["Name", "Email", "Phone", "Position", "Cost / Hour", "Hours / Point", "Created"].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3">{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((employee) => <tr key={employee.id} className="hover:bg-gray-50"><td className="px-4 py-4 font-semibold text-gray-900">{employee.name || "-"}</td><td className="px-4 py-4 text-gray-600">{employee.email || "-"}</td><td className="px-4 py-4 text-gray-600">{employee.phone || "-"}</td><td className="px-4 py-4 text-gray-600">{employee.position || "-"}</td><td className="px-4 py-4 text-gray-600">{employee.cost_per_hour || "-"}</td><td className="px-4 py-4 text-gray-600">{employee.houres_per_point || "-"}</td><td className="whitespace-nowrap px-4 py-4 text-gray-600">{formatDate(employee.created_at)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-gray-100 md:hidden">
            {employees.map((employee) => <article key={employee.id} className="space-y-4 p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-gray-900">{employee.name || "-"}</h2><p className="mt-1 text-sm text-gray-500">{employee.position || "-"}</p></div><p className="whitespace-nowrap text-xs text-gray-400">{formatDate(employee.created_at)}</p></div><EmployeeDetails employee={employee} /></article>)}
          </div>
        </div>
      )}

      {isFormOpen && <EmployeeForm isSubmitting={isSubmitting} error={error} onSubmit={handleCreate} onClose={() => { if (!isSubmitting) setIsFormOpen(false); }} />}
    </div>
  );
}