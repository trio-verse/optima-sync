import { ContractDetailsType } from "@/types/projectQotation";
export default function ContractDetails({
  issue_date,
  client_name,
  quotation_based_version_id,
  valid_until,
  project_title,
  project_description,
}: ContractDetailsType) {
  return (
    <div className="w-full space-y-5 mb-5">
      <div className="flex bg-[#f4f5f7] rounded-lg overflow-hidden border border-[#e3e6ea]">
        <div className="flex-1 p-3 border-r border-[#e3e6ea]">
          <div className="text-[7.5pt] uppercase font-bold text-gray-400 mb-1 tracking-wider">
            Issue Date
          </div>
          <div className="text-[9.5pt] font-bold text-[#0e223b]">
            {issue_date}
          </div>
        </div>

        <div className="flex-1 p-3 border-r border-[#e3e6ea]">
          <div className="text-[7.5pt] uppercase font-bold text-gray-400 mb-1 tracking-wider">
            Directed To
          </div>
          <div className="text-[9.5pt] font-bold text-[#0e223b] truncate">
            {client_name}
          </div>
        </div>

        <div className="flex-1 p-3 border-r border-[#e3e6ea]">
          <div className="text-[7.5pt] uppercase font-bold text-gray-400 mb-1 tracking-wider">
            Version
          </div>
          <div className="text-[9.5pt] font-bold text-[#0e223b]">
            v{quotation_based_version_id}
          </div>
        </div>

        <div className="flex-1 p-3">
          <div className="text-[7.5pt] uppercase font-bold text-gray-400 mb-1 tracking-wider">
            Valid Until
          </div>
          <div className="text-[9.5pt] font-bold text-[#0e223b]">
            {valid_until}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3.5 bg-gradient-to-r from-[#eaf6f9] to-white border border-[#e3e6ea] border-r-4 border-r-[#0e7ba0] rounded-[10px] p-4">
        <div>
          <div className="text-[8pt] text-[#0e7ba0] uppercase tracking-[0.6px] font-bold mb-0.5">
            Prepared exclusively for
          </div>
          <div className="text-[13pt] font-extrabold text-[#0e223b]">
            
            {client_name}
          </div>

        </div>
        
      </div>
      <div className=" p-3 ">
        
          <h2>
            <strong className="tracking-wider uppercase">project: </strong>
            {project_title}
            </h2>
            <p> <strong className="tracking-wider uppercase text-gray-500">description: </strong>
                {project_description}</p>
      </div>

    </div>
  );
}
