import React from "react";
interface ProgressBarProps {
  value: number;
}
const ProgressBar = ({ value }: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-full my-5">
      <div className="mb-2 flex justify-start gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>Task Progress</span>
        <span>{clampedValue}%</span>
      </div>
      <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        {/* Active Fill */}
        <div
          className="h-4 rounded-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
