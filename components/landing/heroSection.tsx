"use client";

import { motion } from "framer-motion";
import { CopyCommand } from "./copy";
import { Safari } from "../ui/safari";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] w-full bg-primary flex flex-col pt-20 pb-10 justify-center text-center px-4 sm:px-6 lg:px-8">
      {/* Radial Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center mt-10">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white shadow-sm cursor-pointer">
            ⚡ AI Powered
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F0F4FF] font-[var(--font-heading)] font-bold w-full cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <span>Make Your Website </span>
          <br />
          <span className="bg-gradient-to-r from-[#6C63FF] via-[#8B5CF6] to-[#FF7EB3] bg-clip-text text-transparent font-[var(--font-main)] inline-block drop-shadow-lg">
            Conversational & Productive
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-[#D1D9E6] font-[var(--font-body)] max-w-xl sm:max-w-2xl lg:max-w-3xl cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          Engage your users with intelligent chat and generate professional documents
          instantly—delivering seamless, AI-powered experiences on your site.
        </motion.p>

        {/* Copy Command */}
        <motion.div
          className="mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          <CopyCommand />
        </motion.div>

        {/* Safari Mock Screen */}
        <motion.div
          className="w-full max-w-[1200px] mt-10 px-2 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        >
          <Safari url="www.askguru.ai" imageSrc="./askguru.png" />
        </motion.div>
      </div>
    </section>
  );
}
