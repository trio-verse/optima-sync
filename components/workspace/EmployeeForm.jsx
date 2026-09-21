"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  position: "",
  cost_per_hour: "",
  houres_per_point: "",
};

export default function EmployeeForm({ isSubmitting, error, onSubmit, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData, () => setFormData(INITIAL_FORM));
  };

  const fields = [
    { name: "name", label: "Name", type: "text", placeholder: "e.g. Duha Nasser" },
    { name: "email", label: "Email", type: "email", placeholder: "employee@example.com" },
    { name: "phone", label: "Phone", type: "tel", placeholder: "+963 900 000 000" },
    { name: "position", label: "Position", type: "text", placeholder: "e.g. Frontend Developer" },
    { name: "cost_per_hour", label: "Cost Per Hour", type: "number", step: "0.01", min: "0", placeholder: "18.00" },
    { name: "houres_per_point", label: "Hours Per Point", type: "number", step: "1", min: "0", placeholder: "2" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add Employee</h2>
            <p className="mt-0.5 text-xs text-gray-500">Add a team member to your organization.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close form">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">{field.label} *</span>
                <input
                  {...field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            ))}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Adding Employee..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}