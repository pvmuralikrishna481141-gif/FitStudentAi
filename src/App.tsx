/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UserProfile, FullPlan } from './types';
import { generateFitnessPlan } from './services/gemini';
import OnboardingForm from './components/OnboardingForm';
import PlanDisplay from './components/PlanDisplay';
import ChatBot from './components/ChatBot';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, RefreshCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<FullPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnboardingSubmit = async (userProfile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateFitnessPlan(userProfile);
      setProfile(userProfile);
      setPlan(generatedPlan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate your personalized plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(null);
    setPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-xl">
              <Dumbbell className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">FitStudent <span className="text-brand-600">AI</span></span>
          </div>
          
          {plan && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-brand-600 transition-colors"
            >
              <RefreshCcw size={16} />
              New Plan
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-5xl font-display font-semibold tracking-tight">
                  Your Fitness Journey, <br />
                  <span className="italic text-brand-600">Personalized by AI.</span>
                </h1>
                <p className="text-zinc-500 text-lg">
                  Get a custom workout and meal plan tailored to your student budget, cultural tastes, and available resources.
                </p>
              </div>

              {error && (
                <div className="max-w-md mx-auto bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-center text-sm">
                  {error}
                </div>
              )}

              <OnboardingForm onSubmit={handleOnboardingSubmit} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-widest mb-2">
                    <Sparkles size={16} />
                    Plan Generated
                  </div>
                  <h1 className="text-4xl font-display font-semibold">Welcome back, Student</h1>
                  <p className="text-zinc-500">Here is your optimized routine for the next 7 days.</p>
                </div>
              </div>

              <PlanDisplay plan={plan.weeklyPlan} advice={plan.generalAdvice} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ChatBot />

      <footer className="py-12 border-t border-zinc-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-400 text-sm">
          <p>© 2024 FitStudent AI. Built for students, by AI.</p>
        </div>
      </footer>
    </div>
  );
}
