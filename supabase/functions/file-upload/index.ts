
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { MongoClient, ObjectId } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

// Initialize MongoDB client with URI from environment variables
const MONGODB_URI = Deno.env.get('MONGODB_URI') || '';
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
}

// Connect to MongoDB
let client: MongoClient | null = null;
async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient();
    try {
      await client.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      client = null;
      throw err;
    }
  }
  return client;
}

// Handler for file upload requests
serve(async (req) => {
  // Set up CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  try {
    // Only accept POST requests for file uploads
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers, status: 405 }
      );
    }

    // Get form data from the request
    const formData = await req.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const category = formData.get('category');
    const fileName = formData.get('fileName');
    
    // Validate input
    if (!file || !userId) {
      return new Response(
        JSON.stringify({ error: 'File and userId are required' }),
        { headers, status: 400 }
      );
    }
    
    // Check if the file is a valid type (PDF, PNG, JPG)
    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file' }),
        { headers, status: 400 }
      );
    }
    
    const fileType = file.type;
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    
    if (!validTypes.includes(fileType)) {
      return new Response(
        JSON.stringify({ error: 'Only PDF, PNG, and JPG files are allowed' }),
        { headers, status: 400 }
      );
    }
    
    // Check file size (limit to 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds the 5MB limit' }),
        { headers, status: 400 }
      );
    }
    
    // In a real-world scenario, you would store the file in a storage system
    // and save the URL in MongoDB. For this example, we'll simulate storage
    // by saving metadata only.
    
    // Connect to MongoDB
    const client = await connectToMongoDB();
    const db = client.database('telecare');
    const documentsCollection = db.collection('documents');
    
    // Create a document record
    const fileExtension = fileType.split('/')[1];
    const documentData = {
      name: fileName || file.name,
      type: fileType,
      size: file.size,
      url: `https://example.com/files/${new ObjectId()}`,  // Simulated URL
      userId: userId.toString(),
      category: category?.toString() || 'general',
      uploadDate: new Date(),
      content: null,  // Would typically be excluded in favor of storing in a dedicated file storage system
    };
    
    // Insert document metadata into MongoDB
    const result = await documentsCollection.insertOne(documentData);
    
    if (result) {
      const insertedDocument = await documentsCollection.findOne({ _id: result.insertedId });
      return new Response(JSON.stringify(insertedDocument), { 
        headers, 
        status: 201 
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to save document metadata' }),
        { headers, status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing file upload:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers, status: 500 }
    );
  }
});
