"use client";

import { motion } from "framer-motion";
import { Cloud, Globe, Layers, Rocket, Star, Sun, Box } from "lucide-react";

const partners = [
  { name: "Nova", icon: Rocket },
  { name: "Orbit", icon: Globe },
  { name: "Nimbus", icon: Cloud },
  { name: "Vertex", icon: Layers },
  { name: "Prism", icon: Box },
  { name: "Atlas", icon: Globe },
  { name: "Stellar", icon: Star },
  { name: "Lumen", icon: Sun },
  { name: "Nova", icon: Rocket },
  { name: "Orbit", icon: Globe },
  { name: "Nimbus", icon: Cloud },
  { name: "Vertex", icon: Layers },
  { name: "Prism", icon: Box },
  { name: "Atlas", icon: Globe },
  { name: "Stellar", icon: Star },
  { name: "Lumen", icon: Sun },
];

export default function PartnersScroller() {
  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <h1 className="text-4xl font-bold text-center mb-12 cursor-pointer">
        Trusted by{" "}
        <span className=" bg-blue-600 bg-clip-text text-transparent">
          Top Companies
        </span>
      </h1>

      <div className="relative w-full overflow-hidden cursor-pointer">
        {/* Left & Right Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent z-10" />

        {/* Scrolling Track */}
        <motion.div
          className="flex md:gap-24 gap-18 whitespace-nowrap cursor-pointer"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...partners, ...partners].map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center gap-2 min-w-[120px]"
              >
                <Icon className="h-10 w-10 text-blue-600 cursor-pointer" />
                <span className="text-sm font-medium cursor-pointer">{partner.name}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
