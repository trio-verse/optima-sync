import React from 'react';

import { SignatureBlockProps } from "@/types/projectQotation";

export default function SignatureBlock({ label }: SignatureBlockProps) {
  return (
    <div className="flex-1">
  
      <div className="h-[50px] border-b-[1.5px] border-[#0e223b] mb-2" />
    
      <div className="text-[9pt] font-bold text-[#0e223b]">
        {label}
      </div>

    
      <div className="text-[8.5pt] text-gray-500 mt-[7px] border-b border-dotted border-[#e3e6ea] pb-[3px] w-[80%]">
        Name &amp; Title
      </div>
      <div className="text-[8.5pt] text-gray-500 mt-[7px] border-b border-dotted border-[#e3e6ea] pb-[3px] w-[80%]">
        Date
      </div>
    </div>
  );
}