import { PricingTotalsAndTermsType } from "@/types/projectQotation";
export default function PricingTotalsAndTerms({
  subtotal,
  tax,
  discount,
  total,
  currency,
  payment_terms,
  valid_until,
}: PricingTotalsAndTermsType) {
  return (
    <div className="space-y-6 mt-6">

      <div className="break-inside-avoid">
        <div className="flex justify-start">
          <div className="w-full min-w-[280px]">
            {/* Subtotal */}
            <div className="flex justify-between py-1.5 px-1 text-[9.8pt] font-bold border-t border-[#e3e6ea] pt-2 text-[#333]">
              <span>Subtotal</span>
              <span>
                ${Number(subtotal).toFixed(2)} {currency}
              </span>
            </div>


            {tax !== null && tax !== undefined && tax !== 0 && (
              <div className="flex justify-between py-1.5 px-1 text-[9.8pt] text-[#333]">
                <span>Tax</span>
                <span>
                  ${Number(tax).toFixed(2)} {currency}
                </span>
              </div>
            )}

            {discount !== null && discount !== undefined && discount !== 0 && (
              <div className="flex justify-between py-1.5 px-1 text-[9.8pt] text-[#c0392b]">
                <span>Discount</span>
                <span>
                  &minus; ${Number(discount).toFixed(2)} {currency}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 px-3.5 mt-2 text-[12pt] font-extrabold text-[#060606] border-y border-[#060606] bg-[#f9fafb]">
              <span>Total</span>
              <span>
                ${Number(total).toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. قسم شروط الدفع وصلاحية العرض (Payment Terms & Validity) */}
      <div className="break-inside-avoid">
        <div className="text-[10.5pt] font-bold text-[#0e223b] uppercase tracking-[0.4px] pb-[5px] mb-[10px] border-b-[1.5px] border-[#0e223b]">
          Payment Terms
        </div>

        <div className="bg-[#f4f5f7] rounded-lg p-3.5 mb-2.5">
          <p className="m-0 text-[9.5pt] text-[#333] whitespace-pre-line font-medium">
            {payment_terms}
          </p>
        </div>

        <p className="text-[8pt] text-gray-500 mt-0.5 italic">
          This quotation is valid until {valid_until}. Prices and scope are
          subject to change after this date.
        </p>
      </div>
    </div>
  );
}
