"use client";

import React from "react";

export interface SelectOption<T extends string | number> {
  key: T; 
  value: string; 
}

interface SelectProps<T extends string | number> {
  options: SelectOption<T>[];
  selectedValue?: T;
  onChange?: (value: T) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function Select<T extends string>({
  options,
  selectedValue,
  onChange,
  // label,
  placeholder = "Select an option",
  disabled = false,
}: SelectProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
      onChange(val as T);
  };

  return (
    <div className="flex flex-col gap-1.5  max-w-xs">
      {/* {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )} */}

      <div className="relative">
        <select
          value={selectedValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-3 py-1  border-0 rounded-2xl bg-blue-100 outline-0 capitalize text-sm text-blue-700 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none cursor-pointer transition-all"
        >
          {/* Default Unselected State */}
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          ))}
        </select>

        {/* Custom Chevron Arrow */}
        
      </div>
    </div>
  );
}
