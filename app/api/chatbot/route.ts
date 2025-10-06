import { NextResponse } from 'next/server';
import axios from 'axios';

// Type definitions
interface RequestBody {
  prompt: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
  }>;
}

export async function POST(request: Request) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: API key is missing' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json() as RequestBody;
    const { prompt } = body;
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Create a medical context for the prompt
    const medicalPrompt = `As a medical assistant, please respond to this patient query: "${prompt}"\n\nProvide helpful, accurate information but clarify you're not giving medical diagnosis.`;
    
    // Call Gemini API
    const response = await axios({
      method: 'post',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        contents: [
          {
            parts: [
              { text: medicalPrompt }
            ]
          }
        ]
      }
    });

    // Extract the text from the response
    const geminiResponse = response.data as GeminiResponse;
    
    if (!geminiResponse.candidates || !geminiResponse.candidates.length) {
      console.error('No candidates in Gemini API response', geminiResponse);
      return NextResponse.json(
        { error: 'Failed to generate a response from AI' },
        { status: 500 }
      );
    }

    const candidate = geminiResponse.candidates[0];
    
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts.length) {
      console.error('Invalid response structure from Gemini API', candidate);
      return NextResponse.json(
        { error: 'Invalid response structure from AI' },
        { status: 500 }
      );
    }

    const replyText = candidate.content.parts[0].text;
    
    if (!replyText) {
      console.error('No text found in Gemini API response', candidate.content.parts);
      return NextResponse.json(
        { error: 'Empty response from AI' },
        { status: 500 }
      );
    }

    // Return the AI response
    return NextResponse.json({ reply: replyText });

  } catch (error) {
    console.error('Error processing Gemini API request:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      // If it's an Axios error (API request failed)
      const status = error.response?.status || 500;
      const message = error.response?.data?.error?.message || 'Failed to fetch response from AI';
      
      return NextResponse.json(
        { error: message },
        { status }
      );
    }
    
    // For other types of errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
