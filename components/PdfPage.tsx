"use client";
import React, { use } from "react";
import QuotationHeader from "./projects/qotation/QuotationHeader";
import ContractDetails from "./projects/qotation/ContractDetails";
import FeatureList from "./projects/qotation/FeatureList";
import PricingSummary from "./projects/qotation/pricingSummary";
import PricingTotalsAndTerms from "./projects/qotation/FinancialSummary";
import Signatures from "./projects/qotation/Signatures";
import QuotationFooter from "./projects/qotation/QuotationFooter";
import { Printer } from "lucide-react";
import { freezeProjectVersion } from "@/actions/publicProjectActions";
import { useSearchParams } from "next/navigation";

export default function PdfPage({ orgId, projectId }: { orgId?: string , projectId?: number }) {
  const searchParams = useSearchParams();
  const vIdParam = searchParams.get("versionId");
  const vId = vIdParam ? Number(vIdParam) : 0;


const handlePrint = async () => {
    
    if (orgId && vId) {
      try {
        freezeProjectVersion(orgId, vId).catch(() => {});
      } catch (err) {
        
      }
    }

    window.print();
  };

  return (
    <div >
<div className="flex justify-end print:hidden mb-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      <QuotationHeader
        organization_name="Optima Sync"
        org_location="New York, NY"
        quo_number="Q-001"
      />
      <ContractDetails
        issue_date="2023-01-01"
        client_name="John Doe"
        quotation_based_version_id={1}
        valid_until="2023-12-31"
        project_title="Project Title"
        project_description="Project Description"
      />
      <FeatureList
        features={[
          { name: "Feature 1", description: "Description for Feature 1" },
          { name: "Feature 2", description: "Description for Feature 2" },
          { name: "Feature 3", description: "Description for Feature 3" },
          { name: "Feature 4", description: "Description for Feature 4" },
          { name: "Feature 5", description: "Description for Feature 5" },
        ]}
      />
      <PricingSummary
        development_fee={5000}
        costs={[
          {
            title: "Cost 1",
            description: "Description for Cost 1",
            amount: 1000,
          },
          {
            title: "Cost 2",
            description: "Description for Cost 2",
            amount: 2000,
          },
                    {
            title: "Cost 3",
            description: "Description for Cost 3",
            amount: 3000,
          },
                                {
            title: "Cost 4",
            description: "Description for Cost 4",
            amount: 4000,
          },
                              {
            title: "Cost 5",
            description: "Description for Cost 5",
            amount: 5000,
          },
                              {
            title: "Cost 6",
            description: "Description for Cost 6",
            amount: 6000,
          },
                                        {
            title: "Cost 7",
            description: "Description for Cost 7",
            amount: 7000,
          },
                                        

        ]}
      />
      <PricingTotalsAndTerms
        subtotal={8000}
        tax={10}
        discount={100}
        total={8000}
        currency="USDT"
        payment_terms="Net 30"
        valid_until="2026-11-30"
      />
        <Signatures organization_name="Optima Sync" client_name="John Doe" />
        <QuotationFooter
  organization_name="ghtcj"
  quo_number="QTN-202510-58-34"

/>
    </div>
  );
}
