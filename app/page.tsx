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
        apiEndpoint: "/askguruLogo.png",
        apiKey: "89a448260f6a102309de8605f30be5d07aa13c1378f114e36d81c7dc8360771c",
        theme: "#715bff",
        botName: "Ask Guru"
      }} />
    </main>
  );
}
