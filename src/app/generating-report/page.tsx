"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const funFacts = [
  "Wasabi-flavored toothpaste was once available in Japan.",
  "75% of shoppers can identify a brand by scent alone.",
  "Taco Bell launched a taco-scented cologne.",
  "Oreos are sold in over 100 countries.",
  "The average American drinks 38 gallons of soda annually.",
  "Bubble Wrap was originally intended as wallpaper.",
  "The average bar of soap lasts 6 showers.",
  "Heinz ketchup exits the bottle at 0.028 mph.",
  "Cereal was originally marketed as a health food.",
  "Coca-Cola was the first soft drink in space.",
  "The Guinness Book of Records was created to settle bar bets.",
  "LEGO produces more tires annually than Goodyear.",
  "Starbucks adds an average of two stores daily worldwide.",
  "The 'new car smell' is actually a mix of over 50 chemicals.",
  "Velcro was inspired by burrs sticking to a dog’s fur.",
  "Twinkies were originally banana-flavored.",
  "Pencils can write in zero gravity.",
  "A single pair of jeans requires 1,800 gallons of water to produce.",
  "The most counterfeited product is Nike shoes.",
  "Pringles once had to prove in court they weren’t potato chips.",
  "M&M's were created for soldiers to eat chocolate without melting.",
  "The red pigment in lipstick often comes from crushed beetles.",
  "Spam is sold in over 40 countries.",
  "The IKEA catalog is more widely distributed than the Bible.",
  "The loudest sound in a store is the opening of a chip bag.",
  "Pop-Tarts were originally designed for farmers.",
  "The hole in the middle of a lifesaver candy prevents choking.",
  "The best-selling flavor of ice cream is vanilla.",
  "Toothpaste caps are one of the most discarded plastics worldwide.",
  "Fanta was created in Nazi Germany during a trade embargo.",
  "Disposable chopsticks kill 4 million trees annually.",
  "Blue jeans were patented in 1873.",
  "Barbie’s full name is Barbara Millicent Roberts.",
  "A single McDonald’s fry has 19 ingredients.",
  "Apple once sold a clothing line called 'Apple Collection.'",
  "Over 200 varieties of Kit Kat are sold in Japan.",
  "The biggest pizza ever made was 13,580 square feet.",
  "Nutella uses about 25% of the world’s hazelnut supply.",
  "Toothpaste tubes produce 60% of their carbon footprint in packaging.",
  "Skittles once tried a 'garlic bread' flavor.",
  "Lays releases over 200 flavors of chips globally.",
  "More Monopoly money is printed annually than real money.",
  "Mountain Dew was created as a whiskey mixer.",
  "Every day, 2 billion cups of coffee are consumed worldwide.",
  "The Coca-Cola logo is recognized by 94% of the world’s population.",
  "A yogurt container takes 20-30 years to decompose.",
  "The average person eats 35 tons of food in a lifetime.",
  "The original Starbucks logo was a topless mermaid.",
  "The longest carrot ever grown was over 20 feet long.",
  "Cows passing gas is one of the largest accelerants of climate change.",
];

export default function GeneratingReport() {
  const [progress, setProgress] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Rotate fun facts every 5 seconds
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
    }, 5000);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 100);

    // Redirect after 10 seconds
    const generateAndRedirect = async () => {
      const baseReportName = "Functional Life Beverages Concept Test Q1 2025";
      const encodedName = encodeURIComponent(baseReportName);
      router.push(`/report/${encodedName}`);
    };

    const timeout = setTimeout(generateAndRedirect, 10000);

    return () => {
      clearInterval(factInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-gray-900">
      {/* Loader */}
      <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>

      {/* Title */}
      <h1 className="text-3xl font-semibold mt-8">Generating Your Report</h1>
      <p className="text-gray-600 text-lg mt-2">Crafting insights tailored for you.</p>

      {/* Progress Bar */}
      <div className="w-full max-w-md mt-8">
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gray-900 transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-gray-500 text-sm mt-2">{progress}%</p>
      </div>

      {/* Fun Fact */}
      <p className="mt-8 text-lg text-gray-700 italic text-center max-w-lg">
        {funFacts[currentFactIndex]}
      </p>
    </div>
  );
}
