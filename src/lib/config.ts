
// Environment variables configuration with fallbacks

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  api: {
    url: string;
  };
  mongodb: {
    uri: string;
  };
}

const config: EnvironmentConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://akyhrcpabemcldsodbme.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreWhyY3BhYmVtY2xkc29kYm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MTk3MjYsImV4cCI6MjA2MDA5NTcyNn0.cDKqnH-SlhlCA4PMLMOD8-S3TC41u2aEeyQvvP0fR3A'
  },
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  },
  mongodb: {
    uri: import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://dganesh2604:Ganesh%40123@cluster0.3fnawcq.mongodb.net/telecare?retryWrites=true&w=majority&appName=Cluster0'
  }
};

export default config;
