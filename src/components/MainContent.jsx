import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/config';
import { invalidateUserSession } from '../firebase/users';
import Header from './layout/Header';
import Navigation from './layout/Navigation';
import Topic from './topics/Topic';
import Video from './topics/Video';
import Admin from './topics/Admin';
import Dashboard from './topics/Dashboard'

const MainContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user?.uid) {
        await invalidateUserSession(user.uid);
      }
      await auth.signOut();
      localStorage.removeItem('lehighmindful_user');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        user={auth.currentUser}
        onLogout={handleLogout}
      />
      <Navigation 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/content/topic" replace />} />
          <Route path="topic" element={<Topic />} />
          <Route path="video" element={<Dashboard />} />
          <Route path="admin" element={<Admin />} />
        </Routes>
        <div className="fixed bottom-16 right-8">
          <div id="lehighmindful-extension-mount" className="h-full" />
        </div>
      </main>
    </div>
  );
};

export default MainContent;