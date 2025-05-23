
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { toast } from "sonner";
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { api } from './api';

export interface UserData {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'patient' | 'doctor' | 'admin' | null;
  photoURL: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async (uid: string) => {
    try {
      console.log("Fetching user data for:", uid);
      // Check localStorage for role
      const storedRole = localStorage.getItem(`user_role_${uid}`);
      console.log("Stored role from localStorage:", storedRole);
      
      // In a real app with Firebase Admin SDK, you would fetch custom claims
      // For this demo, we're still using localStorage
      const mockUserData = {
        uid,
        email: currentUser?.email || null,
        name: currentUser?.displayName || null,
        role: storedRole as 'patient' | 'doctor' | 'admin' | null,
        photoURL: currentUser?.photoURL || null
      };
      
      setUserData(mockUserData);
      console.log("User data loaded:", mockUserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed, user:", user?.uid);
      setCurrentUser(user);
      if (user) {
        fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      
      // Get the user role - in a real implementation with Firebase Admin SDK,
      // this would be retrieved from the custom claims
      const role = localStorage.getItem(`user_role_${userCredential.user.uid}`);
      console.log("User role from login:", role);
      
      // Update userData immediately
      setUserData({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        role: role as 'patient' | 'doctor' | 'admin' | null,
        photoURL: userCredential.user.photoURL
      });
      
      navigate('/dashboard');
      return userCredential;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to login';
      toast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'patient' | 'doctor') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store user role in localStorage (in a real app with Firebase Admin SDK, 
      // this would set custom claims)
      localStorage.setItem(`user_role_${userCredential.user.uid}`, role);
      console.log(`Set user role for ${userCredential.user.uid} to ${role}`);
      
      // Update userData state immediately after sign up
      setUserData({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name,
        role,
        photoURL: userCredential.user.photoURL
      });
      
      toast.success("Account created successfully");
      navigate('/dashboard');
      return userCredential;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create account';
      toast.error(errorMessage);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // For Google sign-in, check if the user already has a role assigned
      // If not, use a default role (patient)
      const existingRole = localStorage.getItem(`user_role_${result.user.uid}`);
      const role = existingRole || 'patient';
      
      if (!existingRole) {
        localStorage.setItem(`user_role_${result.user.uid}`, role);
      }
      
      // Update userData state immediately after sign in
      setUserData({
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        role: role as 'patient' | 'doctor' | 'admin',
        photoURL: result.user.photoURL
      });
      
      toast.success("Google sign-in successful");
      navigate('/dashboard');
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in with Google';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to log out';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signUp,
    logout,
    googleSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
