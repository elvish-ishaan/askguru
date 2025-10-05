"use client"
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
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
      <Footer/>
      <ChatWedget config={{
        apiEndpoint: "http://localhost:3000/api/chat",
        apiKey: "89a448260f6a102309de8605f30be5d07aa13c1378f114e36d81c7dc8360771c",
        theme: "#0fdb2e",
        botName: "live assitent"
      }} />
    </main>
  );
}
