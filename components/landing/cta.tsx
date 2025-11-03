"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CtaCard() {
  const router = useRouter();
  return (
    <section className="relative flex items-center justify-center py-24 px-6 bg-black overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-snug">
          Supercharge Your Website with <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            AI Chat
          </span>
        </h2>

        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Engage users instantly with intelligent, human-like conversations — all in one seamless AI
          platform with {""}
          <span className="text-white font-medium">AskGuru</span>.
        </p>

        <Button
          size="lg"
          onClick={() => router.push("/auth")}
          className="mt-8 px-8 py-3 text-base cursor-pointer font-medium rounded-full bg-white text-black hover:scale-105 hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          Get Started →
        </Button>
      </motion.div>
    </section>
  );
}
