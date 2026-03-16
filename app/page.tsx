"use client"
import CtaCard from "@/components/landing/cta";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import HeroSection  from "@/components/landing/heroSection";
import PartnersScroller from "@/components/landing/partners";
import Testimonials from "@/components/landing/testimonial";
import Navbar from "@/components/navbar/navbar";
import ChatWedget from 'askguru'

export default function Home() {
  return (
    <main>
      <Navbar/>
      <HeroSection/>
      <Features/>
      <PartnersScroller/>
      <Testimonials/>
      <CtaCard/>
      <Footer/>
      <ChatWedget config={{
        apiEndpoint: "http://localhost:3000/api/chat",
        apiKey: process.env.NEXT_PUBLIC_ASKGURU_API_KEY!,
        theme: "#155dfc",
        logoImage: "/logoImg.png",
        botName: "Plugg"
      }} />
    </main>
  );
}
