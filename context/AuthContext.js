"use client"; //Tells next.js to run on the client side

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from '@/lib/firebase';

const AuthContext = createContext(); //Empty container that will hold authentication data and functions

export function useAuth(){ //Function that lets other components easily access auth data
    return useContext(AuthContext);
}

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        }); //callback function to update state
        return unsubscribe; //stops listening to auth changed
    }, []);

const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

const logout = () =>{
    return signOut(auth);
}

const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading
  };

   return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}


