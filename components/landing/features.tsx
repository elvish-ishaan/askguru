"use client";

import { motion } from "framer-motion";
import MagicBento from "../MagicBento";

export default function Features() {
  return (
    <section className="relative w-full py-20 bg-black text-foreground overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-16">

          <motion.div
            className="text-center md:text-left space-y-6 md:max-w-md lg:max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Why Choose{" "}
              <span className="bg-blue-600 bg-clip-text text-transparent">
                AskGuru
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-[#D1D9E6]">
              Discover the next level of AI websites. AskGuru combines smart chat and seamless
              integrations to deliver a truly intelligent user experience.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center w-full max-w-[400px] md:max-w-none"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative flex items-center justify-center w-full">
              <MagicBento
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={200}
                particleCount={8}
                glowColor="132, 0, 255"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
