import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData, isSessionValid } from './firebase/users';
import Login from './components/auth/Login';
import MainContent from './components/MainContent';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('User detected:', firebaseUser);
          const isValid = await isSessionValid(firebaseUser.uid);
          console.log('Session valid:', isValid);
          if (isValid) {
            const userData = await getUserData(firebaseUser.uid);
            setUser(userData);
          } else {
            console.log('Invalid session. Signing out...');
            await auth.signOut();
            setUser(null);
          }
        } else {
          console.log('No user detected');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/content/*"
          element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;