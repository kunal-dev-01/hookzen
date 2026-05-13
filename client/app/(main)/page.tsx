"use client";
import Hero from "@/components/home/Hero";
import PowerSpecs from "@/components/home/PowerSpecs";

function Home() {
  return (
    <div className="w-full relative flex flex-col items-center space-y-24">
      <Hero />
      <PowerSpecs />
    </div>
  );
}

export default Home;
