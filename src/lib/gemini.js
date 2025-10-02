// Google Gemini AI configuration
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. AI features will be disabled.');
}

export const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
export const isGeminiAvailable = !!GEMINI_API_KEY;

export const GEMINI_MODEL = "gemini-2.0-flash-exp";