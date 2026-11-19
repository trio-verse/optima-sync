import React from 'react'

import { useState } from "react";

interface TruncatedTextProps {
  text: string;
  limit?: number;
}
const TruncatedText = ({ text, limit = 50 }:TruncatedTextProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    if (text.length <= limit) {
      return <p className="text-gray-700">{text}</p>;
    }

    const displayedText =
      text.length >= limit && !isExpanded
        ? `${text.slice(0, limit)}...`
        : text;

    const toggleReadMore = () => {
      setIsExpanded((prev) => !prev);
    };
  return (
    <>
      <p className="text-gray-700 transition-all duration-300">
        {displayedText}

        {text.length >= limit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleReadMore();
            }}
            className="ml-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </p>
    </>
  );
};

export default TruncatedText
