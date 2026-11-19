"use client";

import React, { useState, useEffect } from "react";

interface ModelProps {
  buttonText?: string;
  title: string;
  triggerButton?: React.ReactElement<{ onClick: () => void }>;
  children: React.ReactNode | ((closeModal: () => void) => React.ReactNode);
  isbackDropClose: boolean;
}
export function Model(props: ModelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  const handleClose = () => setIsOpen(false);
  return (
    <>
      {props.triggerButton ? (
        React.cloneElement(props.triggerButton, { onClick: handleOpen })
      ) : (
        <button
          onClick={handleOpen}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          {props.buttonText}
        </button>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => {
            if (props.isbackDropClose) setIsOpen(false);
          }} // Closes on backdrop click
        >
          <div
            className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {props.title}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            {/* Content */}
            <div className="mt-4 text-sm text-gray-600">
              {typeof props.children === "function"
                ? props.children(handleClose)
                : props.children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
