import Image from "next/image";
import { QuotationHeaderType } from "@/types/projectQotation";
export default function QuotationHeader({
  organization_name,
  org_location,
  quo_number,
}: QuotationHeaderType) {
  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2.5 opacity-85">
          <Image
            src="/Image/logo.jpg"
            alt="Optima Sync Logo"
            width={160}
            height={50}
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="flex justify-between items-start pb-4 border-b-4 border-[#0e223b] mb-5">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[13pt] font-bold text-[#0e223b] m-0">
                {organization_name}
              </h1>
              <p className="text-[8.5pt] text-gray-500 mt-0.5">
                {org_location}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[9.5pt] text-[#0e7ba0] font-bold tracking-wider uppercase">
              {quo_number}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
