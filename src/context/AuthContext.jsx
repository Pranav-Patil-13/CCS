/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setLoading(false), 6000);
    let unsubUserDoc = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        unsubUserDoc = onSnapshot(
          doc(db, "users", authUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              setUser(docSnap.data());
            } else {
              setUser(null);
            }
            clearTimeout(loadingTimeout);
            setLoading(false);
          },
          (error) => {
            console.error("Error loading user profile listener:", error);
            setUser(null);
            clearTimeout(loadingTimeout);
            setLoading(false);
          }
        );
      } else {
        if (unsubUserDoc) {
          unsubUserDoc();
          unsubUserDoc = null;
        }
        setUser(null);
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        if (userData.role === "company") {
          navigate("/company/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      } else {
        throw new Error("User profile not found in database.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.message);
    }
  };

  const signup = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const uid = userCredential.user.uid;
      const initials = `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
      const name = `${userData.firstName} ${userData.lastName}`;
      const profile = {
        uid,
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name,
        initials,
        globalId: `u_${uid.substring(0, 8)}`,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", uid), profile);
      setUser(profile);
      if (userData.role === "company") {
        navigate("/company/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error.message);
    }
  };

  const loginWithLinkedIn = async (code) => {
    try {
      const authUrl = "https://indiecode.in/api/linkedin-auth";
      const redirectUri = window.location.origin + "/auth/linkedin/callback";
      
      const response = await fetch(authUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch LinkedIn data");
      }

      const linkedInData = await response.json();
      const linkedInId = linkedInData.sub || null;
      const placeholderPassword = `linkedin_${linkedInData.email.replace(/[^a-zA-Z0-9]/g, "")}_secure_pass_13`;
      let authUser;

      try {
        const signinCred = await signInWithEmailAndPassword(
          auth,
          linkedInData.email,
          placeholderPassword
        );
        authUser = signinCred.user;
      } catch {
        const signupCred = await createUserWithEmailAndPassword(
          auth,
          linkedInData.email,
          placeholderPassword
        );
        authUser = signupCred.user;
      }

      const nameParts = linkedInData.name.split(" ");
      const initials = (
        nameParts[0][0] +
        (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "")
      ).toUpperCase();
      const globalId = linkedInId || `u_${authUser.uid.substring(0, 8)}`;
      
      const realUser = {
        uid: authUser.uid,
        email: linkedInData.email,
        role: "employee",
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || "",
        name: linkedInData.name,
        initials,
        photoUrl: linkedInData.picture || null,
        linkedInId,
        globalId,
        createdAt: serverTimestamp(),
      };

      const userDocRef = doc(db, "users", authUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, realUser);
      } else if (linkedInId) {
        const existingData = userDoc.data();
        if (!existingData.linkedInId || !existingData.globalId) {
          await setDoc(
            userDocRef,
            {
              linkedInId,
              globalId,
            },
            { merge: true }
          );
        }
      }
      setUser(userDoc.exists() ? userDoc.data() : realUser);
      navigate("/employee/dashboard");
    } catch (error) {
      console.error("LinkedIn Sign-in failed:", error);
      alert(`LinkedIn Sign-in failed: ${error.message}`);
      navigate("/login");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginWithLinkedIn }}>
      {!loading ? children : (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F8F9FA",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#495057",
        }}>
          Loading workspace...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
