import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FullPlan } from "../types";

const GEMINI_MODEL = "gemini-3.1-pro-preview";

export async function generateFitnessPlan(profile: UserProfile): Promise<FullPlan> {
  // Use import.meta.env for Vite to access the environment variable
  const apiKey = import.meta.env.VITE_Gemini_API_Key;
  
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("Gemini API Key is missing. Please set it in your .env.local file.");
  }

  const ai = new GoogleGenAI({ apiKey });

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

  try {
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
                      snack: mealSchema
                    },
                    required: ["breakfast", "lunch", "dinner"]
                  },
                  workout: {
                    type: Type.OBJECT,
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
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as FullPlan;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please check your Gemini API key in your .env.local file.");
    }
    throw error;
  }
}

export async function startFitnessChat() {
  // Ensure we are using the exact same environment variable name here as well
  const apiKey = import.meta.env.VITE_Gemini_API_Key;
  
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("Gemini API Key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
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