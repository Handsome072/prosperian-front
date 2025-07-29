import React, { useState } from 'react';
import { Check, X, Star, Zap, Crown, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const plans = [
  {
    name: "Starter",
    price: "39",
    period: "/mois",
    yearlyPrice: "468",
    credits: "3 600",
    icon: Building,
    color: "from-gray-500 to-gray-600",
    buttonColor: "bg-[#E95C41] hover:bg-orange-600",
    popular: false
  },
  {
    name: "Pro",
    price: "99",
    period: "/mois",
    yearlyPrice: "1 188",
    credits: "12 000",
    icon: Zap,
    color: "from-blue-500 to-blue-600",
    buttonColor: "bg-[#E95C41] hover:bg-orange-600",
    popular: false
  },
  {
    name: "Growth",
    price: "199",
    period: "/mois",
    yearlyPrice: "2 388",
    credits: "36 000",
    icon: Star,
    color: "from-[#E95C41] to-orange-600",
    buttonColor: "bg-white text-[#E95C41] hover:bg-gray-50",
    popular: true
  },
  {
    name: "Scale",
    price: "299",
    period: "/mois",
    yearlyPrice: "3 588",
    credits: "72 000",
    icon: Crown,
    color: "from-purple-600 to-purple-700",
    buttonColor: "bg-[#E95C41] hover:bg-orange-600",
    popular: false
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    yearlyPrice: "",
    credits: "72 000+",
    icon: Crown,
    color: "from-indigo-600 to-indigo-700",
    buttonColor: "bg-[#E95C41] hover:bg-orange-600",
    popular: false,
    customButton: "PRENDRE RDV"
  }
];

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan.name);
    // Navigation vers la page de paiement avec les paramètres du plan
    const params = new URLSearchParams({
      plan: plan.name,
      price: plan.price,
      credits: plan.credits
    });
    navigate(`/payment?${params.toString()}`);
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Tarification</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choisissez le plan qui correspond le mieux à vos besoins. 
            Commencez dès aujourd'hui avec l'abonnement qui vous convient.
          </p>
        </div>

        {/* Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg shadow-lg border-2 transition-all duration-300 hover:shadow-xl min-h-[500px] ${
                plan.popular 
                  ? 'bg-blue-900 text-white border-blue-900' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-[#E95C41] text-white px-3 py-1 rounded-full text-xs font-medium">
                    Populaire
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col h-full">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex flex-col items-center">
                      <span className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                        {plan.price === "Sur devis" ? "Sur devis" : `€${plan.price}${plan.period}`}
                      </span>
                      {plan.yearlyPrice && (
                        <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                          Soit {plan.yearlyPrice}€/an
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="mb-6">
                    <span className={`text-lg font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.credits} Crédits / an
                    </span>
                  </div>

                </div>

                {/* Spacer to push button to bottom */}
                <div className="flex-grow"></div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full ${plan.buttonColor} py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm`}
                >
                  <span>{plan.customButton || "SOUSCRIRE"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        



        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Besoin d'aide pour choisir le bon plan ?
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="text-[#E95C41] hover:text-orange-600 font-medium transition-colors"
          >
            Contactez notre équipe de vente
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage; 