"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

export default function WelcomeNoOrg() {
    return (
        <div className="min-h-lvh flex justify-center items-center bg-gradient-to-tr from-slate-50 via-blue-50/30 to-zinc-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white/60 flex flex-col items-center justify-center text-center rounded-2xl p-8 shadow-sm border border-white/40"
            >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                    <Building2 className="w-8 h-8 text-blue-600" />
                </div>

                <h1 className="text-zinc-900 font-extrabold text-2xl mb-2">
                    Welcome to Optima Sync
                </h1>
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                    You do not have any organisations yet. Create one to start managing
                    your team, projects, and ERP operations.
                </p>

                <Link href="/create-profile" className="w-full">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-colors">
                        Create Your Organisation
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}