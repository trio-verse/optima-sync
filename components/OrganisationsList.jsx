"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Building2, Plus } from "lucide-react";

export default function OrganisationsList({ organisations }) {
    const router = useRouter();

    return (
        <div className="min-h-lvh flex justify-center items-center bg-gradient-to-tr from-slate-50 via-blue-50/30 to-zinc-100 p-6">
            <div className="w-full max-w-md bg-white/60 rounded-2xl p-6 shadow-sm border border-white/40">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-zinc-900 font-extrabold text-xl">
                        Your Organisations
                    </h1>
                    <Link href="/create-profile">
                        <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                            New Organaisation
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col gap-2.5">
                    {organisations.map((org) => (
                        <button
                            key={org.id}
                            onClick={() => router.push(`/${org.id}/dashboard`)}
                            className="flex items-center gap-3 bg-white border border-zinc-200 hover:border-blue-400 hover:shadow-sm rounded-xl px-4 py-3 text-left transition-all cursor-pointer"
                        >
                            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0">
                                {org.logo_url ? (
                                    <Image
                                        src={org.logo_url}
                                        alt={org.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                ) : (
                                    <Building2 className="w-5 h-5 text-zinc-400" />
                                )}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-zinc-900 font-semibold text-sm truncate">
                                    {org.name}
                                </span>
                                <span className="text-zinc-500 text-xs capitalize">
                                    {org.role}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}