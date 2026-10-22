import {ProjectCost} from "@/types/projectQotation";
import { Check } from 'lucide-react';
export default function CostItem({title,description,amount}:ProjectCost){
    return(
<li className="flex items-start gap-2 text-sm break-inside-avoid py-1">

      <span className="text-[#377491] font-bold text-base leading-none mt-0.5">
        <Check size={16} />
      </span>

      <span>
        <strong className="font-semibold text-gray-900">{title}</strong>
        {description && ` — ${description}`}
      </span>
      <span className="ml-auto font-bold text-gray-900">
        ${amount.toFixed(2)}
      </span>

    </li>
    )
}