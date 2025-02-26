import React from 'react';
import Link from 'next/link';

interface PricingCardsProps {
  title?: string;
  subtitle?: string;
}

const PricingCards: React.FC<PricingCardsProps> = ({ 
  title = "Get started with Simporter now",
  subtitle = "Choose the plan that's right for you"
}) => {
  const plans = [
    {
      name: "Free",
      description: "Explore how Simporter can help with market research",
      price: "$0",
      frequency: "/month",
      tokens: "25,000 tokens per month",
      ctaText: "Get Free",
      ctaLink: "/signup"
    },
    {
      name: "Starter",
      description: "Level up your research with expanded data access",
      price: "$25",
      frequency: "/month",
      tokens: "400,000 tokens per month",
      ctaText: "Get Starter",
      ctaLink: "/signup/starter"
    },
    {
      name: "Professional",
      description: "Get comprehensive insights for your business",
      price: "$75",
      frequency: "/month",
      tokens: "1,250,000 tokens per month",
      ctaText: "Get Professional",
      ctaLink: "/signup/professional"
    },
    {
      name: "Enterprise",
      description: "Advanced analytics for large organizations",
      price: "$250",
      frequency: "/month",
      tokens: "4,500,000 tokens per month",
      ctaText: "Contact Sales",
      ctaLink: "/contact"
    }
  ];

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">{subtitle}</p>
          )}
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="border rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500 h-12">{plan.description}</p>
                <p className="mt-4">
                  <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-base font-medium text-gray-500">{plan.frequency}</span>
                </p>
                <p className="mt-2 text-sm text-gray-500">{plan.tokens}</p>
                
                <div className="mt-8">
                  <Link 
                    href={plan.ctaLink}
                    className="block w-full py-2 px-4 border border-blue-600 rounded-md text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingCards;