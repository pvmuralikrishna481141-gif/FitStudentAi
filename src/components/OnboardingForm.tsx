import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Target, Utensils, Dumbbell, Wallet, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export default function OnboardingForm({ onSubmit, isLoading }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: 20,
    gender: 'other',
    weight: 70,
    height: 175,
    goal: 'maintenance',
    dietaryPreference: 'no-restrictions',
    budget: 'medium',
    availableEquipment: [],
    activityLevel: 'moderate',
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 4) {
      onSubmit(profile as UserProfile);
    } else {
      handleNext();
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const toggleEquipment = (item: string) => {
    const current = profile.availableEquipment || [];
    if (current.includes(item)) {
      updateProfile({ availableEquipment: current.filter(i => i !== item) });
    } else {
      updateProfile({ availableEquipment: [...current, item] });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 mx-1 rounded-full transition-colors duration-500 ${
              step >= i ? 'bg-brand-500' : 'bg-zinc-200'
            }`}
          />
        ))}
      </div>

      <motion.form
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        key={step}
        onSubmit={handleSubmit}
        className="glass p-8 rounded-3xl"
      >
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-brand-600" />
              <h2 className="text-2xl font-semibold">Basic Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={e => updateProfile({ age: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">Gender</label>
                <select
                  value={profile.gender}
                  onChange={e => updateProfile({ gender: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={e => updateProfile({ weight: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">Height (cm)</label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={e => updateProfile({ height: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-brand-600" />
              <h2 className="text-2xl font-semibold">Goals & Activity</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">What's your main goal?</label>
                <div className="grid grid-cols-2 gap-3">
                  {['weight-loss', 'muscle-gain', 'maintenance', 'endurance'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateProfile({ goal: g as any })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        profile.goal === g ? 'border-brand-500 bg-brand-50' : 'border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <span className="capitalize">{g.replace('-', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">Activity Level</label>
                <select
                  value={profile.activityLevel}
                  onChange={e => updateProfile({ activityLevel: e.target.value as any })}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="sedentary">Sedentary (Office job, little exercise)</option>
                  <option value="light">Light (1-2 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very-active">Very Active (Athlete level)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Utensils className="text-brand-600" />
              <h2 className="text-2xl font-semibold">Diet & Budget</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">Dietary Preference</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Halal, No restrictions"
                  value={profile.dietaryPreference}
                  onChange={e => updateProfile({ dietaryPreference: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600 flex items-center gap-2">
                  <Globe size={16} /> Cultural Background (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indian, Mediterranean, East Asian"
                  value={profile.culturalBackground}
                  onChange={e => updateProfile({ culturalBackground: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600 flex items-center gap-2">
                  <Wallet size={16} /> Monthly Food Budget
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateProfile({ budget: b as any })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        profile.budget === b ? 'border-brand-500 bg-brand-50' : 'border-zinc-100'
                      }`}
                    >
                      <span className="capitalize">{b}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Dumbbell className="text-brand-600" />
              <h2 className="text-2xl font-semibold">Equipment</h2>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-600">What do you have access to?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Full Gym', 'Dumbbells', 'Resistance Bands', 'Pull-up Bar', 'Bodyweight Only', 'Yoga Mat'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleEquipment(item)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      profile.availableEquipment?.includes(item) ? 'border-brand-500 bg-brand-50' : 'border-zinc-100'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 p-4 rounded-2xl border border-zinc-200 font-medium hover:bg-zinc-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] p-4 rounded-2xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating Plan...' : step === 4 ? 'Create My Plan' : 'Continue'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
