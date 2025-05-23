
// This service implements MongoDB database operations

import { toast } from "sonner";
import config from "./config";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  photoURL?: string;
  createdAt: Date;
}

export interface StoredDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  userId: string;
  category: string;
  uploadDate: Date;
}

export interface AppointmentRecord {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

// This service uses Supabase Edge Functions to interact with MongoDB
class DbService {
  private async callMongoDBApi(endpoint: string, method: string = 'GET', data?: any) {
    try {
      console.log(`Calling MongoDB API: ${endpoint} with method: ${method}`);
      console.log("Data being sent:", data);
      
      const response = await fetch(`${config.api.url}/mongodb/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`MongoDB API Error (${endpoint}):`, errorData);
        throw new Error(errorData.message || 'An error occurred with the MongoDB operation');
      }
      
      const responseData = await response.json();
      console.log(`MongoDB API Response (${endpoint}):`, responseData);
      return responseData;
    } catch (error) {
      console.error(`MongoDB API Error (${endpoint}):`, error);
      throw error;
    }
  }
  
  // User operations
  saveUser = async (userData: Partial<User>): Promise<User> => {
    console.log("Saving user to MongoDB:", userData);
    
    try {
      return await this.callMongoDBApi('users', 'POST', userData);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user information");
      throw error;
    }
  };
  
  getUser = async (userId: string): Promise<User | null> => {
    console.log("Getting user from MongoDB:", userId);
    
    try {
      return await this.callMongoDBApi(`users/${userId}`);
    } catch (error) {
      console.error("Error getting user:", error);
      toast.error("Failed to retrieve user information");
      throw error;
    }
  };
  
  // Document operations
  saveDocument = async (document: Partial<StoredDocument>): Promise<StoredDocument> => {
    console.log("Saving document to MongoDB:", document);
    
    try {
      return await this.callMongoDBApi('documents', 'POST', document);
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Failed to save document");
      throw error;
    }
  };
  
  getDocuments = async (userId: string): Promise<StoredDocument[]> => {
    console.log("Getting documents for user from MongoDB:", userId);
    
    try {
      return await this.callMongoDBApi(`documents/user/${userId}`);
    } catch (error) {
      console.error("Error getting documents:", error);
      toast.error("Failed to retrieve documents");
      throw error;
    }
  };
  
  // Appointment operations
  saveAppointment = async (appointment: Partial<AppointmentRecord>): Promise<AppointmentRecord> => {
    console.log("Saving appointment to MongoDB:", appointment);
    
    if (!appointment.patientId) {
      console.error("Missing patientId in appointment data");
      toast.error("Patient ID is required for booking an appointment");
      throw new Error("Patient ID is required");
    }
    
    if (!appointment.doctorId) {
      console.error("Missing doctorId in appointment data");
      toast.error("Doctor ID is required for booking an appointment");
      throw new Error("Doctor ID is required");
    }
    
    try {
      return await this.callMongoDBApi('appointments', 'POST', appointment);
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("Failed to save appointment");
      throw error;
    }
  };
  
  getAppointmentsForPatient = async (patientId: string): Promise<AppointmentRecord[]> => {
    console.log("Getting appointments for patient from MongoDB:", patientId);
    
    try {
      return await this.callMongoDBApi(`appointments/patient/${patientId}`);
    } catch (error) {
      console.error("Error getting patient appointments:", error);
      toast.error("Failed to retrieve appointments");
      throw error;
    }
  };
  
  getAppointmentsForDoctor = async (doctorId: string): Promise<AppointmentRecord[]> => {
    console.log("Getting appointments for doctor from MongoDB:", doctorId);
    
    try {
      return await this.callMongoDBApi(`appointments/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error getting doctor appointments:", error);
      toast.error("Failed to retrieve appointments");
      throw error;
    }
  };
}

export const dbService = new DbService();
