import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FullPlan } from "../types";

const GEMINI_MODEL = "gemini-3.1-pro-preview";

export async function generateFitnessPlan(profile: UserProfile): Promise<FullPlan> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  const prompt = `
    Generate a highly personalized 7-day workout and meal plan for a student with the following profile:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Weight: ${profile.weight}kg, Height: ${profile.height}cm
    - Goal: ${profile.goal}
    - Dietary Preference: ${profile.dietaryPreference}
    - Cultural Background: ${profile.culturalBackground || 'Not specified'}
    - Budget: ${profile.budget} (Focus on cheap, accessible ingredients for students)
    - Available Equipment: ${profile.availableEquipment.join(', ')}
    - Activity Level: ${profile.activityLevel}

    The plan must be practical for a student living in a dorm or shared apartment. 
    Consider cultural food habits and budget-friendly options (e.g., bulk buying, simple prep).
    
    Return the response in JSON format.
  `;

  const mealSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
      calories: { type: Type.NUMBER },
      protein: { type: Type.NUMBER },
      carbs: { type: Type.NUMBER },
      fats: { type: Type.NUMBER },
      instructions: { type: Type.STRING },
      budgetNote: { type: Type.STRING }
    },
    required: ["name", "ingredients", "calories", "protein", "carbs", "fats", "instructions"]
  };

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weeklyPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                meals: {
                  type: Type.OBJECT,
                  properties: {
                    breakfast: mealSchema,
                    lunch: mealSchema,
                    dinner: mealSchema,
                    snack: { ...mealSchema, nullable: true }
                  },
                  required: ["breakfast", "lunch", "dinner"]
                },
                workout: {
                  type: Type.OBJECT,
                  nullable: true,
                  properties: {
                    name: { type: Type.STRING },
                    exercises: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          sets: { type: Type.INTEGER },
                          reps: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          notes: { type: Type.STRING }
                        },
                        required: ["name", "sets", "reps"]
                      }
                    },
                    durationMinutes: { type: Type.INTEGER },
                    focusArea: { type: Type.STRING }
                  },
                  required: ["name", "exercises", "durationMinutes", "focusArea"]
                }
              },
              required: ["day", "meals"]
            }
          },
          generalAdvice: { type: Type.STRING }
        },
        required: ["weeklyPlan", "generalAdvice"]
      } as any
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate plan");
  
  return JSON.parse(text) as FullPlan;
}

export async function startFitnessChat() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  return ai.chats.create({
    model: GEMINI_MODEL,
    config: {
      systemInstruction: `
        You are an expert Physical Trainer and Nutritional Specialist specifically focused on helping students.
        Your goal is to provide practical, budget-friendly, and scientifically sound advice.
        You understand the constraints of student life: limited time, shared kitchens, small budgets, and high stress.
        Always be encouraging, professional, and provide actionable steps.
        If asked about medical conditions, always advise consulting a professional.
      `,
    },
  });
}
