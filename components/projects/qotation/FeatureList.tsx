import FeatureItem from "./FeatureItem";
import { ProjectFeature } from "@/types/projectQotation";
export default function FeatureList({features}: {features: ProjectFeature[]}) {
  return (
    <div>
    <h3>
        PROJECT SCOPE:
        <hr className="w-full bg-black h-[2px] my-2" />
    </h3>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <FeatureItem key={index} {...feature} />
      ))}
    </ul>
    </div>

  );
}
