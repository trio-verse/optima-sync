import {ProjectFeature} from "@/types/projectQotation";
import { Check } from 'lucide-react';
export default function FeatureItem({name,description}:ProjectFeature){
    return(
<li className="flex items-start gap-2 text-sm break-inside-avoid py-1">

      <span className="text-[#377491] font-bold text-base leading-none mt-0.5">
        <Check size={16} />
      </span>

      <span>
        <strong className="font-semibold text-gray-900">{name}</strong>
        {description && ` — ${description}`}
      </span>
    </li>
    )
}