"use client"
import HeroSection  from "@/components/landing/heroSection";
import Navbar from "@/components/navbar/navbar";
import ChatWedget from 'askguru'

export default function Home() {
  return (
    <main>
      <Navbar/>
      <HeroSection/>

      <ChatWedget config={{
        apiKey: "89sdf8s7df9s7d8f9sf"
      }} />
    </main>
  );
}
