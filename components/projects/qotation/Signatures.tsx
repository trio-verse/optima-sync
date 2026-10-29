import React from 'react';
import SignaturesBlock from './SignaturesBlock';

import {SignaturesProps} from "@/types/projectQotation";

export default function Signatures({ organization_name, client_name }: SignaturesProps) {
  return (
    <div className="flex justify-between gap-[40px] my-[26px] mb-[14px] break-inside-avoid">
     
      <SignaturesBlock label={`Authorized Signature — ${organization_name}`} />

     
      <SignaturesBlock label={`Authorized Signature — ${client_name}`} />
    </div>
  );
}