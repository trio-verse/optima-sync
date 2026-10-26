import { ProjectPricing } from "@/types/projectQotation";
import CostItem from "./CostItem";
export default function PricingSummary({
  development_fee,
  costs,
}: ProjectPricing) {
  return (
    <div className="mt-6 break-inside-avoid">
      <div className="text-sm font-bold text-[#0e223b] uppercase tracking-[0.4px] pb-1 mb-3 border-b-2 border-[#0e223b]">
        Pricing Summary
      </div>

      <table className="w-full border-collapse text-sm mb-6">
        <tbody>
          <tr className="">
            <td className="py-2 px-2.5 text-gray-800">Development Fee</td>
            <td className="py-2 px-2.5 text-right font-medium text-gray-900">
              ${development_fee}
            </td>
          </tr>
  

          {costs.map((cost, index) => (
            <tr className="" key={index}>
              <td className="py-2 px-2.5 text-gray-800">
                {cost.title} - {cost.description}
              </td>
              <td className="py-2 px-2.5 text-right font-medium text-gray-900">
                ${cost.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
