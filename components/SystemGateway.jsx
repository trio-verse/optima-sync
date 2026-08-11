"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="min-h-lvh flex flex-col justify-center items-center bg-gradient-to-tr from-slate-50 via-blue-50/30 to-zinc-100 p-4 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-3xl flex flex-col items-center justify-center space-y-6"
            >

                <span className="bg-blue-100/70 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-blue-200 shadow-sm">
                    ✨ Next Generation ERP System
                </span>


                <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                    Manage Your Business & Organizations <span className="text-blue-700">Effortlessly</span>
                </h1>


                <p className="text-zinc-600 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
                    Say goodbye to complex passwords. Access your workspace securely with passwordless authentication, build your team, and scale seamlessly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">

                    <Link href="/register" className="w-full sm:w-auto">
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-colors"
                        >
                            Get Started Free
                        </motion.button>
                    </Link>


                    <Link href="/register" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 font-semibold text-sm px-8 py-3.5 rounded-xl transition-colors shadow-sm">
                            Sign In
                        </button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}