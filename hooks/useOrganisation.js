"use client";

import { useState, useEffect } from "react";
import { getOrganisationById } from "../actions/organisationActions";

export function useOrganisation() {
  const [organisationId, setOrganisationId] = useState(null);
  const [organisationData, setOrganisationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrg() {
      setLoading(true);
      const res = await getOrganisationById();

      if (res.success && res.data) {
        setOrganisationData(res.data);
        setOrganisationId(res.data.id || res.data.organization_id);
      } else {
        setError(res.message || "Failed to load organization");
      }
      setLoading(false);
    }

    fetchOrg();
  }, []);

  return { organisationId, organisationData, loading, error };
}
