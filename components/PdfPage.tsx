import QuotationHeader from "./projects/qotation/QuotationHeader";
import ContractDetails from "./projects/qotation/ContractDetails";
import FeatureList from "./projects/qotation/FeatureList";
import PricingSummary from "./projects/qotation/pricingSummary";
import PricingTotalsAndTerms from "./projects/qotation/FinancialSummary";
import Signatures from "./projects/qotation/Signatures";
import QuotationFooter from "./projects/qotation/QuotationFooter";

export default function PdfPage() {
  return (
    <>
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
    </>
  );
}
