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
        apiKey: "8532cf8e9b6bacd0b7712998105ea549cbcf38c2e76d54a12895b0c6eeca7dd3",
        theme: "#715bff",
        logoImage: "/askguruLogo.png",
        botName: "Ask Guru"
      }} />
    </main>
  );
}
