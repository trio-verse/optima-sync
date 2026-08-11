"use client";

import { useState, useEffect } from "react";
import { getCity } from "../actions/services/cityService";
import { getIndustry } from "../actions/services/industryService";

export function useClientLookups() {
  const [cities, setCities] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cityRes, industryRes] = await Promise.all([
        getCity(),
        getIndustry(),
      ]);

      if (cityRes?.success && Array.isArray(cityRes.data)) {
        setCities(cityRes.data);
      }

      if (industryRes?.success && Array.isArray(industryRes.data)) {
        setIndustries(industryRes.data);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  return { cities, industries, loadingLookups: loading };
}
