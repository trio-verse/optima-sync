import React from 'react'
import { Loader2 } from 'lucide-react'
const LoadingCard = ({title}:{title:string}) => {
  return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading {title}...</span>
      </div>
  )
}

export default LoadingCard
