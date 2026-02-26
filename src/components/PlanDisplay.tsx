import { DayPlan, Meal, Workout } from '../types';
import { motion } from 'motion/react';
import { Utensils, Dumbbell, ChevronRight, Info } from 'lucide-react';
import { useState } from 'react';

interface PlanDisplayProps {
  plan: DayPlan[];
  advice: string;
}

export default function PlanDisplay({ plan, advice }: PlanDisplayProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const currentDay = plan[selectedDay];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
        {plan.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(idx)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl font-medium transition-all ${
              selectedDay === idx 
                ? 'bg-brand-600 text-white shadow-lg scale-105' 
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-wider text-xs font-bold">
              <Utensils size={16} />
              Nutrition Plan
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <MealCard type="Breakfast" meal={currentDay.meals.breakfast} />
              <MealCard type="Lunch" meal={currentDay.meals.lunch} />
              <MealCard type="Dinner" meal={currentDay.meals.dinner} />
              {currentDay.meals.snack && <MealCard type="Snack" meal={currentDay.meals.snack} />}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-wider text-xs font-bold">
              <Dumbbell size={16} />
              Workout Routine
            </div>
            {currentDay.workout ? (
              <WorkoutCard workout={currentDay.workout} />
            ) : (
              <div className="glass p-8 rounded-3xl text-center text-zinc-500 italic">
                Rest Day - Focus on recovery and light stretching.
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-brand-600 font-bold">
              <Info size={20} />
              AI Personal Advice
            </div>
            <p className="text-zinc-600 leading-relaxed text-sm">
              {advice}
            </p>
          </div>

          <div className="bg-brand-600 p-6 rounded-3xl text-white space-y-4">
            <h3 className="font-bold text-lg">Student Tip</h3>
            <p className="text-brand-100 text-sm">
              Meal prepping on Sundays can save you up to 10 hours and $50 per week. Use the bulk ingredients listed in your instructions!
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MealCard({ type, meal }: { type: string, meal: Meal }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      className="glass rounded-3xl overflow-hidden"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-start"
      >
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-tighter">{type}</span>
          <h4 className="text-lg font-semibold mt-1">{meal.name}</h4>
          <div className="flex gap-3 mt-2 text-xs text-zinc-500">
            <span>{meal.calories} kcal</span>
            <span>P: {meal.protein}g</span>
            <span>C: {meal.carbs}g</span>
          </div>
        </div>
        <ChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-6 pb-6 space-y-4 border-t border-zinc-100 pt-4"
        >
          <div>
            <h5 className="text-xs font-bold uppercase text-zinc-400 mb-2">Ingredients</h5>
            <ul className="text-sm text-zinc-600 space-y-1">
              {meal.ingredients.map((ing, i) => <li key={i}>• {ing}</li>)}
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase text-zinc-400 mb-2">Instructions</h5>
            <p className="text-sm text-zinc-600 leading-relaxed">{meal.instructions}</p>
          </div>
          {meal.budgetNote && (
            <div className="bg-amber-50 p-3 rounded-xl text-xs text-amber-700">
              <strong>Budget Tip:</strong> {meal.budgetNote}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <div className="glass rounded-3xl p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold">{workout.name}</h3>
          <p className="text-zinc-500">{workout.focusArea} • {workout.durationMinutes} mins</p>
        </div>
      </div>

      <div className="space-y-3">
        {workout.exercises.map((ex, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
            <div>
              <h5 className="font-semibold">{ex.name}</h5>
              {ex.notes && <p className="text-xs text-zinc-500">{ex.notes}</p>}
            </div>
            <div className="text-right">
              <span className="text-brand-600 font-bold">{ex.sets} × {ex.reps}</span>
              {ex.duration && <p className="text-xs text-zinc-400">{ex.duration}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
