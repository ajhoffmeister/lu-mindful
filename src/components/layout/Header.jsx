import React from 'react';
import { Menu, X } from 'lucide-react';

const Header = ({ isMenuOpen, setIsMenuOpen, user, onLogout }) => {
  return (
    <header className="bg-blue-600 text-white px-4 py-4 w-full">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Site Title */}
        <h1 className="text-2xl font-bold whitespace-nowrap">Lehigh Mindfulness Study</h1>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block">{user.email}</span>
              <button
                onClick={onLogout}
                className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden bg-blue-500 p-2 rounded hover:bg-blue-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>

  );
};

export default Header;