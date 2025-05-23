
import axios from 'axios';
import { auth } from './firebase';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// More robust initialization with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

console.log('Supabase initialized with URL:', supabaseUrl);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Firebase API client
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Supabase API functions
export const supabaseApi = {
  // Auth functions
  auth: {
    signup: async (email: string, password: string, name: string, role: 'patient' | 'doctor') => {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'signup', email, password, name, role }
      });
      
      if (error) throw error;
      return data;
    },
    
    login: async (email: string, password: string) => {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'login', email, password }
      });
      
      if (error) throw error;
      return data;
    }
  },
  
  // Documents functions
  documents: {
    getAll: async (type: string = 'all') => {
      const { data, error } = await supabase.functions.invoke('documents', {
        method: 'GET',
        query: { type }
      });
      
      if (error) throw error;
      return data;
    },
    
    create: async (documentData: {
      name: string,
      documentType: string,
      fileName: string,
      fileSize: string,
      fileType: string,
      category: string
    }) => {
      const { data, error } = await supabase.functions.invoke('documents', {
        method: 'POST',
        body: documentData
      });
      
      if (error) throw error;
      return data;
    },
    
    delete: async (id: string) => {
      const { data, error } = await supabase.functions.invoke('documents', {
        method: 'DELETE',
        body: { id }
      });
      
      if (error) throw error;
      return data;
    },
    
    upload: async (file: File, documentType: string) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      
      const { data, error } = await supabase.functions.invoke('upload', {
        method: 'POST',
        body: formData
      });
      
      if (error) throw error;
      return data;
    }
  },
  
  // Prescriptions functions
  prescriptions: {
    getAll: async () => {
      const { data, error } = await supabase.functions.invoke('prescriptions', {
        method: 'GET'
      });
      
      if (error) throw error;
      return data;
    },
    
    getById: async (id: string) => {
      const { data, error } = await supabase.functions.invoke('prescriptions', {
        method: 'GET',
        query: { id }
      });
      
      if (error) throw error;
      return data;
    },
    
    create: async (prescriptionData: {
      patientId: string,
      medications: Array<{
        name: string,
        dosage: string,
        frequency: string,
        duration: string,
        instructions?: string
      }>,
      notes?: string,
      followUpDate?: string
    }) => {
      const { data, error } = await supabase.functions.invoke('prescriptions', {
        method: 'POST',
        body: prescriptionData
      });
      
      if (error) throw error;
      return data;
    }
  },
  
  // Appointments functions
  appointments: {
    getAll: async (status: string = 'all') => {
      const { data, error } = await supabase.functions.invoke('appointments', {
        method: 'GET',
        query: { status }
      });
      
      if (error) throw error;
      return data;
    },
    
    getById: async (id: string) => {
      const { data, error } = await supabase.functions.invoke('appointments', {
        method: 'GET',
        query: { id }
      });
      
      if (error) throw error;
      return data;
    },
    
    create: async (appointmentData: {
      doctorId: string,
      date: string,
      time: string,
      type: string,
      reason: string,
      symptoms?: string
    }) => {
      const { data, error } = await supabase.functions.invoke('appointments', {
        method: 'POST',
        body: appointmentData
      });
      
      if (error) throw error;
      return data;
    },
    
    updateStatus: async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
      const { data, error } = await supabase.functions.invoke('appointments', {
        method: 'PATCH',
        body: { id, status }
      });
      
      if (error) throw error;
      return data;
    }
  }
};

export { api };
