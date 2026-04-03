import React from 'react';
import { Check, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { cn } from '../lib/utils';

export const Pricing: React.FC = () => {
  const { user, profile } = useAuth();

  const handleUpgrade = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // In a real app, this would redirect to Stripe
    // For this demo, we'll just toggle Pro status
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isPro: true
      });
      alert('Successfully upgraded to Pro! (Demo Mode)');
    } catch (err) {
      console.error(err);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        '5 generations per day',
        'All AI tools included',
        'Basic SEO optimization',
        'Community support'
      ],
      buttonText: 'Current Plan',
      current: !profile?.isPro,
      highlight: false
    },
    {
      name: 'Pro',
      price: '1000',
      description: 'For serious content creators',
      features: [
        'Unlimited generations',
        'Priority AI processing',
        'Advanced SEO strategies',
        'Viral script templates',
        '24/7 Priority support'
      ],
      buttonText: 'Upgrade to Pro',
      current: profile?.isPro,
      highlight: true
    }
  ];

  return (
    <div className="space-y-16 py-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Simple, Transparent <span className="text-red-600">Pricing</span></h1>
        <p className="text-zinc-400 text-lg">Choose the plan that fits your growth strategy. No hidden fees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative p-8 rounded-[40px] border transition-all duration-500",
              plan.highlight 
                ? "bg-zinc-900 border-red-600/50 shadow-2xl shadow-red-600/10 scale-105 z-10" 
                : "bg-zinc-900/50 border-white/10"
            )}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-zinc-500 text-sm mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">Rs {plan.price}</span>
                <span className="text-zinc-500">/month</span>
              </div>

              <button
                onClick={plan.name === 'Pro' ? handleUpgrade : undefined}
                disabled={plan.current}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                  plan.highlight
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                    : "bg-white text-black hover:bg-zinc-200",
                  plan.current && "opacity-50 cursor-default"
                )}
              >
                {plan.highlight && <Zap className="w-5 h-5" />}
                {plan.current ? 'Current Plan' : plan.buttonText}
              </button>

              <div className="space-y-4 pt-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={cn(
                      "p-1 rounded-full",
                      plan.highlight ? "bg-red-600/20 text-red-500" : "bg-zinc-800 text-zinc-400"
                    )}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto p-8 bg-zinc-900/30 border border-white/5 rounded-3xl text-center space-y-4">
        <h3 className="text-xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          Why choose Pro?
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The Pro plan is designed for creators who publish more than 2 videos a week. With unlimited generations, you can experiment with dozens of titles and scripts to find the perfect viral formula without worrying about daily limits.
        </p>
      </div>
    </div>
  );
};
