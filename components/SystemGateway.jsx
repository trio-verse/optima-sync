"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"] 
});

export default function HeroSection() {
  return (
    <section className={`min-h-screen relative overflow-hidden flex flex-col justify-center items-center bg-white p-6 text-center ${inter.className}`}>
      
      {/* خلفية التدرج فوق خلفية بيضاء ثابتة */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/40 to-blue-100/30 pointer-events-none" />

      {/* خلفية الإضاءة */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-2xl flex flex-col items-center justify-center space-y-6"
      >
        {/* البادج العلوي */}
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-blue-200/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Next Generation ERP System
        </span>

        {/* العنوان الرئيسي */}
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-snug">
          Manage Your Business & Organizations{" "}
          <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Effortlessly
          </span>
        </h1>

        {/* النص الفرعي */}
        <p className="text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed font-normal">
          Say goodbye to complex passwords. Access your workspace securely with passwordless authentication, build your team, and scale seamlessly.
        </p>

        {/* زر التفاعل */}
        <div className="pt-2">
          <Link href="/register">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-7 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}