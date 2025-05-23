
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { MongoClient, ObjectId } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

// Initialize MongoDB client with URI from environment variables
const MONGODB_URI = Deno.env.get('MONGODB_URI') || 'mongodb+srv://dganesh2604:Ganesh%40123@cluster0.3fnawcq.mongodb.net/telecare?retryWrites=true&w=majority&appName=Cluster0';
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
}

console.log('Connecting to MongoDB with URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Log URI with credentials redacted

// Connect to MongoDB
let client: MongoClient | null = null;
async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient();
    try {
      await client.connect(MONGODB_URI);
      console.log('Connected to MongoDB successfully');
      
      // Test database connection by listing collections
      const db = client.database('telecare');
      const collections = await db.listCollections();
      console.log('Available collections:', collections);
      
      // Create collections if they don't exist
      if (!collections.includes('users')) {
        console.log('Creating users collection');
        await db.createCollection('users');
      }
      
      if (!collections.includes('documents')) {
        console.log('Creating documents collection');
        await db.createCollection('documents');
      }
      
      if (!collections.includes('appointments')) {
        console.log('Creating appointments collection');
        await db.createCollection('appointments');
      }
      
      if (!collections.includes('prescriptions')) {
        console.log('Creating prescriptions collection');
        await db.createCollection('prescriptions');
      }
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      client = null;
      throw err;
    }
  }
  return client;
}

// Handler for all MongoDB API requests
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
    console.log(`MongoDB API request received: ${req.method} ${new URL(req.url).pathname}`);
    
    // Get MongoDB client
    const client = await connectToMongoDB();
    const db = client.database('telecare');
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Remove 'mongodb' from path parts
    pathParts.shift();
    
    console.log('Path parts:', pathParts);
    
    const collection = pathParts[0];
    const method = req.method;
    
    console.log(`Processing request for collection: ${collection}, method: ${method}`);
    
    // Handle different API endpoints based on URL paths and HTTP methods
    
    // USERS collection operations
    if (collection === 'users') {
      const usersCollection = db.collection('users');
      
      // GET a specific user by ID
      if (method === 'GET' && pathParts.length > 1) {
        const userId = pathParts[1];
        console.log(`Fetching user with ID: ${userId}`);
        
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        
        if (!user) {
          console.log(`User not found with ID: ${userId}`);
          return new Response(JSON.stringify({ error: 'User not found' }), { 
            headers, 
            status: 404 
          });
        }
        
        console.log(`User found:`, user);
        return new Response(JSON.stringify(user), { headers });
      }
      
      // GET all users
      else if (method === 'GET') {
        console.log('Fetching all users');
        const users = await usersCollection.find().toArray();
        console.log(`Found ${users.length} users`);
        return new Response(JSON.stringify(users), { headers });
      }
      
      // POST - Create a new user
      else if (method === 'POST') {
        const userData = await req.json();
        console.log('Creating new user:', userData);
        
        const result = await usersCollection.insertOne(userData);
        
        if (result) {
          const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
          console.log('User created successfully:', insertedUser);
          return new Response(JSON.stringify(insertedUser), { headers, status: 201 });
        } else {
          console.error('Failed to create user');
          return new Response(JSON.stringify({ error: 'Failed to create user' }), { 
            headers, 
            status: 500 
          });
        }
      }
    }
    
    // DOCUMENTS collection operations
    else if (collection === 'documents') {
      const documentsCollection = db.collection('documents');
      
      // GET documents for a specific user
      if (method === 'GET' && pathParts.length > 2 && pathParts[1] === 'user') {
        const userId = pathParts[2];
        console.log(`Fetching documents for user: ${userId}`);
        
        const documents = await documentsCollection.find({ userId }).toArray();
        console.log(`Found ${documents.length} documents for user ${userId}`);
        return new Response(JSON.stringify(documents), { headers });
      }
      
      // GET a specific document by ID
      else if (method === 'GET' && pathParts.length > 1) {
        const documentId = pathParts[1];
        console.log(`Fetching document with ID: ${documentId}`);
        
        const document = await documentsCollection.findOne({ _id: new ObjectId(documentId) });
        
        if (!document) {
          console.log(`Document not found with ID: ${documentId}`);
          return new Response(JSON.stringify({ error: 'Document not found' }), { 
            headers, 
            status: 404 
          });
        }
        
        console.log('Document found:', document);
        return new Response(JSON.stringify(document), { headers });
      }
      
      // POST - Create a new document
      else if (method === 'POST') {
        const documentData = await req.json();
        console.log('Creating new document:', documentData);
        
        const result = await documentsCollection.insertOne(documentData);
        
        if (result) {
          const insertedDocument = await documentsCollection.findOne({ _id: result.insertedId });
          console.log('Document created successfully:', insertedDocument);
          return new Response(JSON.stringify(insertedDocument), { headers, status: 201 });
        } else {
          console.error('Failed to create document');
          return new Response(JSON.stringify({ error: 'Failed to create document' }), { 
            headers, 
            status: 500 
          });
        }
      }
      
      // DELETE - Remove a document
      else if (method === 'DELETE' && pathParts.length > 1) {
        const documentId = pathParts[1];
        console.log(`Deleting document with ID: ${documentId}`);
        
        const result = await documentsCollection.deleteOne({ _id: new ObjectId(documentId) });
        
        if (result && result.deletedCount > 0) {
          console.log(`Document ${documentId} deleted successfully`);
          return new Response(JSON.stringify({ success: true }), { headers });
        } else {
          console.log(`Document ${documentId} not found or already deleted`);
          return new Response(JSON.stringify({ error: 'Document not found or already deleted' }), { 
            headers, 
            status: 404 
          });
        }
      }
    }
    
    // APPOINTMENTS collection operations
    else if (collection === 'appointments') {
      const appointmentsCollection = db.collection('appointments');
      
      // GET appointments for a doctor or patient
      if (method === 'GET' && pathParts.length > 2 && (pathParts[1] === 'doctor' || pathParts[1] === 'patient')) {
        const field = pathParts[1] === 'doctor' ? 'doctorId' : 'patientId';
        const id = pathParts[2];
        console.log(`Fetching appointments for ${pathParts[1]}: ${id}`);
        
        const appointments = await appointmentsCollection.find({ [field]: id }).toArray();
        console.log(`Found ${appointments.length} appointments for ${pathParts[1]} ${id}`);
        return new Response(JSON.stringify(appointments), { headers });
      }
      
      // GET a specific appointment by ID
      else if (method === 'GET' && pathParts.length > 1) {
        const appointmentId = pathParts[1];
        console.log(`Fetching appointment with ID: ${appointmentId}`);
        
        const appointment = await appointmentsCollection.findOne({ _id: new ObjectId(appointmentId) });
        
        if (!appointment) {
          console.log(`Appointment not found with ID: ${appointmentId}`);
          return new Response(JSON.stringify({ error: 'Appointment not found' }), { 
            headers, 
            status: 404 
          });
        }
        
        console.log('Appointment found:', appointment);
        return new Response(JSON.stringify(appointment), { headers });
      }
      
      // POST - Create a new appointment
      else if (method === 'POST') {
        try {
          const appointmentData = await req.json();
          console.log('Creating new appointment:', appointmentData);
          
          // Perform validation
          if (!appointmentData.patientId) {
            throw new Error('Patient ID is required');
          }
          if (!appointmentData.doctorId) {
            throw new Error('Doctor ID is required');
          }
          if (!appointmentData.date) {
            throw new Error('Appointment date is required');
          }
          if (!appointmentData.time) {
            throw new Error('Appointment time is required');
          }
          
          const result = await appointmentsCollection.insertOne(appointmentData);
          
          if (result) {
            const insertedAppointment = await appointmentsCollection.findOne({ _id: result.insertedId });
            console.log('Appointment created successfully:', insertedAppointment);
            return new Response(JSON.stringify(insertedAppointment), { headers, status: 201 });
          } else {
            throw new Error('Failed to create appointment in database');
          }
        } catch (error) {
          console.error('Error creating appointment:', error.message);
          return new Response(JSON.stringify({ error: error.message }), { 
            headers, 
            status: 400 
          });
        }
      }
      
      // PATCH - Update appointment status
      else if ((method === 'PATCH' || method === 'PUT') && pathParts.length > 1) {
        const appointmentId = pathParts[1];
        const updates = await req.json();
        console.log(`Updating appointment ${appointmentId}:`, updates);
        
        const result = await appointmentsCollection.updateOne(
          { _id: new ObjectId(appointmentId) },
          { $set: updates }
        );
        
        if (result && result.modifiedCount > 0) {
          const updatedAppointment = await appointmentsCollection.findOne({ _id: new ObjectId(appointmentId) });
          console.log('Appointment updated successfully:', updatedAppointment);
          return new Response(JSON.stringify(updatedAppointment), { headers });
        } else {
          console.log(`Appointment ${appointmentId} not found or no changes made`);
          return new Response(JSON.stringify({ error: 'Appointment not found or no changes made' }), { 
            headers, 
            status: 404 
          });
        }
      }
    }
    
    // PRESCRIPTIONS collection operations
    else if (collection === 'prescriptions') {
      const prescriptionsCollection = db.collection('prescriptions');
      
      // GET prescriptions for a patient
      if (method === 'GET' && pathParts.length > 2 && pathParts[1] === 'patient') {
        const patientId = pathParts[2];
        console.log(`Fetching prescriptions for patient: ${patientId}`);
        
        const prescriptions = await prescriptionsCollection.find({ patientId }).toArray();
        console.log(`Found ${prescriptions.length} prescriptions for patient ${patientId}`);
        return new Response(JSON.stringify(prescriptions), { headers });
      }
      
      // GET a specific prescription by ID
      else if (method === 'GET' && pathParts.length > 1) {
        const prescriptionId = pathParts[1];
        console.log(`Fetching prescription with ID: ${prescriptionId}`);
        
        const prescription = await prescriptionsCollection.findOne({ _id: new ObjectId(prescriptionId) });
        
        if (!prescription) {
          console.log(`Prescription not found with ID: ${prescriptionId}`);
          return new Response(JSON.stringify({ error: 'Prescription not found' }), { 
            headers, 
            status: 404 
          });
        }
        
        console.log('Prescription found:', prescription);
        return new Response(JSON.stringify(prescription), { headers });
      }
      
      // POST - Create a new prescription
      else if (method === 'POST') {
        const prescriptionData = await req.json();
        console.log('Creating new prescription:', prescriptionData);
        
        const result = await prescriptionsCollection.insertOne(prescriptionData);
        
        if (result) {
          const insertedPrescription = await prescriptionsCollection.findOne({ _id: result.insertedId });
          console.log('Prescription created successfully:', insertedPrescription);
          return new Response(JSON.stringify(insertedPrescription), { headers, status: 201 });
        } else {
          console.error('Failed to create prescription');
          return new Response(JSON.stringify({ error: 'Failed to create prescription' }), { 
            headers, 
            status: 500 
          });
        }
      }
    }
    
    // If no matching endpoint is found
    console.log(`Endpoint not found: ${collection}, method: ${method}, path: ${pathParts.join('/')}`);
    return new Response(JSON.stringify({ error: 'Endpoint not found' }), { 
      headers, 
      status: 404 
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers, status: 500 }
    );
  }
});
