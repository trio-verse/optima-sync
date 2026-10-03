"use client";

import { useEffect, useRef, useState } from "react";

export default function MultiSelectCheckbox({
  options = [],
  value = [],
  onChange,
  placeholder = "Select options...",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize values to strings for comparison
  const selectedValues = Array.isArray(value) ? value.map(String) : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (optionValue) => {
    const stringValue = String(optionValue);

    let newValues;

    if (selectedValues.includes(stringValue)) {
      // Remove value
      newValues = selectedValues.filter((value) => value !== stringValue);
    } else {
      // Add value
      newValues = [...selectedValues, stringValue];
    }

    onChange(newValues);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((option) => String(option.value)));
    }
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(String(option.value)),
  );

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectedOptions.length <= 2) {
      return selectedOptions.map((option) => option.label).join(", ");
    }

    return `${selectedOptions.length} selected`;
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Select button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          w-full
          min-h-[40px]
          px-3
          py-2
          text-sm
          text-left
          bg-white
          border
          border-zinc-300
          rounded-lg
          flex
          items-center
          justify-between
          gap-2
          hover:border-zinc-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/20
          focus:border-blue-500
        "
      >
        <span
          className={
            selectedOptions.length === 0 ? "text-zinc-400" : "text-zinc-700"
          }
        >
          {getDisplayText()}
        </span>

        {/* Arrow */}
        <svg
          className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            z-50
            mt-1
            w-full
            bg-white
            border
            border-zinc-200
            rounded-lg
            shadow-lg
            overflow-hidden
          "
        >
          {/* Select All */}
          {options.length > 0 && (
            <div className="border-b border-zinc-200 px-3 py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    options.length > 0 &&
                    selectedValues.length === options.length
                  }
                  onChange={handleSelectAll}
                  className="
                    h-4
                    w-4
                    rounded
                    border-zinc-300
                    text-orange-500
                    focus:ring-orange-500
                  "
                />

                <span className="text-sm font-medium text-zinc-700">
                  Select All
                </span>
              </label>
            </div>
          )}

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-4 text-sm text-zinc-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const optionValue = String(option.value);

                const isSelected = selectedValues.includes(optionValue);

                return (
                  <label
                    key={optionValue}
                    className="
                      flex
                      items-center
                      gap-2
                      px-3
                      py-2
                      cursor-pointer
                      hover:bg-zinc-50
                    "
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(option.value)}
                      className="
                        h-4
                        w-4
                        rounded
                        border-zinc-300
                        text-orange-500
                        focus:ring-orange-500
                      "
                    />

                    <span className="text-sm text-zinc-700">
                      {option.label}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
