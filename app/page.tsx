"use client"
import Features from "@/components/landing/features";
import HeroSection  from "@/components/landing/heroSection";
import PartnersMarquee from "@/components/landing/partners";
import Navbar from "@/components/navbar/navbar";
import ChatWedget from 'askguru'

export default function Home() {
  return (
    <main>
      <Navbar/>
      <HeroSection/>
      <Features/>
      <PartnersMarquee/>
      <ChatWedget config={{
        apiKey: "89sdf8s7df9s7d8f9sf"
      }} />
    </main>
  );
}
