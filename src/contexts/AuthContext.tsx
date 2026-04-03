import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isPro: boolean;
  usageCount: number;
  lastResetDate: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Cleanup previous profile listener if it exists
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Start listening to profile immediately
        unsubscribeProfile = onSnapshot(userDocRef, async (docSnapshot) => {
          try {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data() as UserProfile;
              const lastReset = new Date(data.lastResetDate);
              const today = new Date();
              
              // Check if it's a new day (ignoring time)
              if (lastReset.toDateString() !== today.toDateString()) {
                try {
                  await setDoc(userDocRef, {
                    usageCount: 0,
                    lastResetDate: today.toISOString()
                  }, { merge: true });
                } catch (err) {
                  handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
                }
              }
              setProfile(data);
            } else {
              // Create profile if it doesn't exist
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                isPro: false,
                usageCount: 0,
                lastResetDate: new Date().toISOString(),
              };
              try {
                await setDoc(userDocRef, newProfile);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
              }
              setProfile(newProfile);
            }
            setLoading(false);
          } catch (err) {
            console.error('Profile snapshot error:', err);
            setLoading(false);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, data);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
