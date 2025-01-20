"use client";

import React from "react";

interface ShopItem {
  id: number;
  name: string;
  description: string;
  image: string;
  tokensRequired: number;
  price: string;
  url: string;
}

const productsFromHTML: ShopItem[] = [
  {
    id: 1,
    name: "Hair Oil",
    description: "Hair oil for stronger, longer, and healthier hair.",
    image: "https://gethappypills.com/cdn/shop/files/1732137759402-generated-label-image-1_ea915396-8d4b-41af-b972-b3f3f4e815db.jpg?v=1732137902",
    tokensRequired: 250, // Example conversion: $25 = 250 tokens
    price: "$25.00",
    url: "https://gethappypills.com/products/hair-oil",
  },
  {
    id: 2,
    name: "Energy Strips",
    description: "Quick energy boost with natural ingredients.",
    image: "https://gethappypills.com/cdn/shop/files/1732207014152-generated-label-image-1.jpg?v=1732207032",
    tokensRequired: 150, // Example conversion: $15 = 150 tokens
    price: "$15.00",
    url: "https://gethappypills.com/products/energy-strips",
  },
  {
    id: 3,
    name: "Hangover Strips",
    description: "Recover faster with these hangover relief strips.",
    image: "https://gethappypills.com/cdn/shop/files/1732391519485-generated-label-image-1.jpg?v=1732391532",
    tokensRequired: 200, // Example conversion: $20 = 200 tokens
    price: "$20.00",
    url: "https://gethappypills.com/products/hangover-strips",
  },
  {
    id: 4,
    name: "Soap Bar",
    description: "Luxurious soap bar for clean and refreshed skin.",
    image: "https://gethappypills.com/cdn/shop/files/1732133025706-generated-label-image-0.jpg?v=1732133365",
    tokensRequired: 120, // Example conversion: $12 = 120 tokens
    price: "$12.00",
    url: "https://gethappypills.com/products/soap-bar",
  },
  {
    id: 5,
    name: "Dog Ear Cleaning Wipes",
    description: "Gentle and effective ear cleaning for your pet.",
    image: "https://gethappypills.com/cdn/shop/files/HappyPillsDogEarCleaningWipes-FrontView.webp?v=1730333134",
    tokensRequired: 124, // $12.35 rounded to tokens
    price: "$12.35",
    url: "https://gethappypills.com/products/dog-ear-cleaning-wipes",
  },
  {
    id: 6,
    name: "Mushroom Coffee",
    description: "Fusion coffee with Lion's Mane and Chaga.",
    image: "https://gethappypills.com/cdn/shop/files/Happy_Pills_Mushroom_Coffee.webp?v=1730232240",
    tokensRequired: 155, // $15.45 rounded to tokens
    price: "$15.45",
    url: "https://gethappypills.com/products/mushroom-coffee-fusion-lion-s-mane-chaga-4oz",
  },
];

const Shop: React.FC = () => {
  const handleRedeem = (id: number) => {
    const item = productsFromHTML.find((product) => product.id === id);
    if (item) {
      alert(`Redeemed: ${item.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-4">Shop</h1>
        <p className="text-gray-600 mb-8">Redeem your tokens for exclusive rewards!</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsFromHTML.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-xl transition-all"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full rounded-lg mb-4"
                />
              </a>
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-gray-900 font-semibold mt-2">
                {item.tokensRequired} Tokens ({item.price})
              </p>
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700"
                onClick={() => handleRedeem(item.id)}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
