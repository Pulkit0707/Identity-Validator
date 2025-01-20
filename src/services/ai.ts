import { CohereClient } from 'cohere-ai';
import type { Profile } from '../types';

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;

if (!COHERE_API_KEY) {
  console.error('Cohere API key is not set in environment variables');
}

const cohere = new CohereClient({
  token: COHERE_API_KEY,
});

export async function analyzeProfile(profile: Profile) {
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `As a professional career advisor and resume expert, analyze this professional profile and provide a rating out of 100 along with specific recommendations for improvement: ${JSON.stringify(profile, null, 2)}`,
      maxTokens: 500,
      temperature: 0.7,
    });

    return response.generations[0].text;
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