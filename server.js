import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// API route for Gemini AI chatbot
app.post('/api/chatbot', async (req, res) => {
  console.log('Server received a request');
  try {
    const { prompt } = req.body;
    
    console.log('Received request:', req.body);
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error: API key is missing' });
    }
    
    console.log('Received prompt:', prompt);
    
    // Log the API key usage
    console.log('Using API Key:', apiKey ? 'Yes' : 'No');
    
    // Create a medical context for the prompt
    const medicalPrompt = `As a medical assistant, please respond to this patient query: "${prompt}"\n\nProvide helpful, accurate information but clarify you're not giving medical diagnosis.`;
    
    // Call Gemini API
    const response = await axios({
      method: 'post',
      url:`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
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
    
    // Log the response from Gemini API
    console.log('Gemini API Response:', response.data);
    
    // Check if response has expected data
    if (!response.data.candidates || !response.data.candidates.length) {
      console.error('No candidates in Gemini API response');
      return res.status(500).json({ error: 'Failed to generate a response from AI' });
    }
    
    const candidate = response.data.candidates[0];
    
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts.length) {
      console.error('Invalid response structure from Gemini API');
      return res.status(500).json({ error: 'Invalid response structure from AI' });
    }
    
    const replyText = candidate.content.parts[0].text;
    
    if (!replyText) {
      console.error('No text found in Gemini API response');
      return res.status(500).json({ error: 'Empty response from AI' });
    }
    
    console.log('Sending response:', { reply: replyText });
    
    // Return the AI response
    return res.json({ reply: replyText });
    
  } catch (error) {
    console.error('Error processing Gemini API request:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error?.message || 'Failed to fetch response from AI';
      console.log('Error response:', { error: message, status });
      return res.status(status).json({ error: message });
    }
    
    // For other types of errors
    console.log('Error response:', { error: 'Internal server error' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
