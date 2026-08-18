"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { getClients } from "@/actions/clientActions";
import { useClientLookups } from "@/hooks/useClientLookups";

export default function ClientsListPage({ params }) {
  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId;

  const { cities, industries } = useClientLookups(orgId);

  const [clients, setClients] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    searchName: "",
    searchContact: "",
    cityId: "",
    industryId: "",
    type: "",
    page: 1,
  });

  const fetchClientsData = useCallback(async () => {
    setLoading(true);
    const res = await getClients(filters, orgId);
    if (res.success) {
      setClients(res.data);
      setMeta(res.meta);
    }
    setLoading(false);
  }, [filters, orgId]);

  useEffect(() => {
    fetchClientsData();
  }, [fetchClientsData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div className="p-6 space-y-6" dir="ltr">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Client Management</h1>
        <Link
          href={`/${orgId}/dashboard/clients/create`}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shrink-0"
        >
          <span>+</span> Add New Client
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <input
          type="text"
          name="searchName"
          placeholder="Search by client name..."
          value={filters.searchName}
          onChange={handleFilterChange}
          className="border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="searchContact"
          placeholder="Search by phone / email..."
          value={filters.searchContact}
          onChange={handleFilterChange}
          className="border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
        <select
          name="cityId"
          value={filters.cityId}
          onChange={handleFilterChange}
          className="border border-gray-200 p-2 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="industryId"
          value={filters.industryId}
          onChange={handleFilterChange}
          className="border border-gray-200 p-2 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Industries</option>
          {industries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.name}
            </option>
          ))}
        </select>
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border border-gray-200 p-2 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="company">Company</option>
          <option value="individual">Individual</option>
          <option value="government">Government </option>
          <option value="charity">Charity</option>
          <option value="agency">Agency</option>
        </select>
      </div>

      {/* Clients Table */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          Loading data...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="p-3.5 pl-5">Name</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">City</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5 text-right pr-5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="p-3.5 pl-5 font-semibold text-gray-900">
                      {client.name}
                    </td>

                    <td className="p-3.5 text-gray-600">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {client.type || client.client_type || "-"}
                      </span>
                    </td>

                    <td className="p-3.5 text-gray-600">
                      {client.address?.city?.name || client.city?.name || "-"}
                    </td>

                    <td className="p-3.5 text-gray-600">
                      {client.contact_info?.phone || client.phone || "-"}
                    </td>

                    <td className="p-3.5 text-right pr-5">
                      <Link
                        href={`/${orgId}/dashboard/clients/${client.id}`}
                        title="View Client Details"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-500">
                    No clients match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}