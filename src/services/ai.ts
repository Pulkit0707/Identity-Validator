import { CohereClient } from 'cohere-ai';
import type { Profile } from '../types';

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;

if (!COHERE_API_KEY) {
  console.error('Cohere API key is not set in environment variables');
}

const cohere = new CohereClient({
  token: COHERE_API_KEY,
});

function getBadgeUrl(score: number): string {
  if (score >= 90) {
    return 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=400&auto=format&fit=crop&q=80'; // Gold trophy
  } else if (score >= 70) {
    return 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&auto=format&fit=crop&q=80'; // Silver medal
  } else if (score >= 50) {
    return 'https://images.unsplash.com/photo-1605666044195-31194bb7e71e?w=400&auto=format&fit=crop&q=80'; // Bronze medal
  } else {
    return 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=400&auto=format&fit=crop&q=80'; // Growth/improvement
  }
}

export async function analyzeProfile(profile: Profile) {
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `As a professional career advisor and resume expert, analyze this professional profile and provide a detailed analysis. Start with a numerical rating out of 100, followed by specific recommendations for improvement. Format your response like this:
      
      Rating: [number]
      
      Analysis:
      [Your detailed analysis]
      
      Recommendations:
      1. [First recommendation]
      2. [Second recommendation]
      3. [Third recommendation]
      
      Profile details: ${JSON.stringify(profile, null, 2)}`,
      maxTokens: 500,
      temperature: 0.7,
    });

    const text = response.generations[0].text;
    
    // Extract rating from the response
    const ratingMatch = text.match(/Rating:\s*(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;
    
    return {
      text,
      rating,
      badgeUrl: getBadgeUrl(rating)
    };
  } catch (error) {
    console.error('Error analyzing profile:', error);
    throw error;
  }
}

export async function generateResume(profile: Profile) {
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `As a professional resume writer, generate a well-formatted resume in markdown format based on this profile information: ${JSON.stringify(profile, null, 2)}`,
      maxTokens: 1000,
      temperature: 0.7,
    });

    return response.generations[0].text;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
}

export async function generateColdEmail(profile: Profile) {
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `As a professional career coach specializing in cold email outreach, generate a personalized cold email template based on this candidate's profile: ${JSON.stringify(profile, null, 2)}`,
      maxTokens: 500,
      temperature: 0.7,
    });

    return response.generations[0].text;
  } catch (error) {
    console.error('Error generating cold email:', error);
    throw error;
  }
}