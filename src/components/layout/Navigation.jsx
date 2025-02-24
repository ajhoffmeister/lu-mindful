import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, PenTool, MonitorPlay, FileSliders } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || 'topic';

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const adminRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setIsAdmin(true);
        }
      }
    };

    checkAdminStatus();
  }, []);

  const topics = [
    { id: 'topic', name: 'Info', icon: Book },
    { id: 'video', name: 'Videos', icon: MonitorPlay }
  ];

  if (isAdmin) {
    console.log("admin detected!")
    topics.push({ id: 'admin', name: 'Admin', icon: FileSliders });
  }

  return (
    <nav className={`bg-white shadow ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
      <div className="container mx-auto px-4">
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <li key={topic.id}>
                <Link
                  to={`/content/${topic.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 w-full md:w-auto ${
                    currentPath === topic.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon size={20} />
                  <span>{topic.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;