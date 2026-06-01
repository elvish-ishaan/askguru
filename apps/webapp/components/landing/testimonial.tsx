"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Menon",
    role: "Manager, Next Solutions",
    quote:
      "AskGuru has completely transformed how we handle customer queries and support. Our response times and team efficiency have improved drastically.",
    img: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "David Chen",
    role: "Founder, BrightPath Systems",
    quote:
      "The automation and conversational intelligence have saved us countless hours. Truly next-gen technology for modern teams.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Thompson",
    role: "Head of Marketing, FlowBridge",
    quote:
      "AskGuru gave our customers a personalized support experience that feels natural, fast, and incredibly engaging.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Rohit Verma",
    role: "Product Manager, InnoSphere",
    quote:
      "Smooth setup and impressive performance. Our workflow feels faster and more connected with AskGuru’s intelligent chat system.",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Elena Rodriguez",
    role: "CTO, Visionary Softworks",
    quote:
      "AskGuru has become an integral part of our operations — the AI chat experience and smart insights are truly game-changing.",
    img: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    name: "Diego Morales",
    role: "Manager, Bright Solutions",
    quote:
      "The AI insights and smart automation helped our business scale faster and engage customers more effectively.",
    img: "https://randomuser.me/api/portraits/men/51.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="relative w-full bg-black py-24 text-white">
      {/* Header */}
      <div className="text-center mb-16 px-6">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center text-sm tracking-widest text-gray-400 font-medium bg-[#151515]/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#2A2A2A]"
        >
          <Star className="w-4 h-4 mr-2 text-blue-600" />
          Testimonials
        </motion.span>
        <h2 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight">
          Building Trust{" "}
          <span className="bg-blue-600 bg-clip-text text-transparent">
            Through Experience
          </span>
        </h2>
        <p className="mt-4 text-lg text-[#A1A1AA] max-w-2xl mx-auto">
          Hear what real users say about how AskGuru transformed their workflow.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="mx-auto max-w-6xl px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Card className="bg-[#111111] border border-[#1F1F1F] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 h-full cursor-pointer">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <p className="text-[#E4E4E7] text-base leading-relaxed mb-6">“{t.quote}”</p>
                <div className="flex items-center gap-3 mt-auto">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={t.img} />
                    <AvatarFallback>
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-[#E4E4E7] text-sm">{t.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
