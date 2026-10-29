
export const STAGES = {
  lead: {
    label: "Lead",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "bg-amber-400",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  contacted: {
    label: "Contacted",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    bar: "bg-blue-500",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  missing_info: {
    label: "Missing Info",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    bar: "bg-purple-400",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  interested: {
    label: "Interested",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  not_interested: {
    label: "Not Interested",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    bar: "bg-gray-400",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  win: {
    label: "Win",
    badge: "bg-green-100 text-green-700 border-green-200",
    bar: "bg-green-500",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  closed: {
    label: "Closed",
    badge: "bg-red-100 text-red-700 border-red-200",
    bar: "bg-red-400",
    color: "bg-red-100 text-red-700 border-red-200",
  },
} as const;