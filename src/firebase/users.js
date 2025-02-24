import { db } from './config';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

// Create user document in users_lehigh collection
export const createUserDocument = async (user) => {
  if (!user?.uid) {
    console.error('No user ID provided');
    return null;
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    
    const userData = {
      email: user.email,
      createdAt: new Date(),
      loginSessionExpiresAt: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
      status: 'active'
    };

    await setDoc(userRef, userData);
    console.log('User document created successfully');
    
    return userRef;
  } catch (error) {
    console.error('Error creating user document:', error);
    // Log specific error information
    if (error.code === 'permission-denied') {
      console.error('Permission denied. Check security rules.');
    }
    throw error;
  }
};

// Get user data from users_lehigh collection
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const getUserPrefData = async (uid) => {
  try {
    const userRef = doc(db, 'users_lehigh', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Update user session in users_lehigh collection
export const updateUserSession = async (uid) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const now = new Date();
  
  try {
    await setDoc(userRef, {
      loginSessionExpiresAt: new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)),
      status: "active"
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user session:', error);
  }
};

// Invalide user session in users_lehigh collection
export const invalidateUserSession = async (uid) => {
    if (!uid) return;
  
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        loginSessionExpiresAt: new Date(), // Set to current time (expired)
        status: "inactive"
      }, { merge: true });
    } catch (error) {
      console.error('Error invalidating user session:', error);
    }
  };

// Get all active users
export const getActiveUsers = async () => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION), 
      where("status", "==", "active")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching active users:', error);
    return [];
  }
};

// Deactivate user
export const deactivateUser = async (uid) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  
  try {
    await setDoc(userRef, {
      status: "inactive",
      loginSessionExpiresAt: new Date() // Expire session immediately
    }, { merge: true });
  } catch (error) {
    console.error('Error deactivating user:', error);
  }
};

// Check if session is valid
export const isSessionValid = async (uid) => {
  try {
    const userData = await getUserData(uid);
    if (!userData) return false;

    const now = new Date();
    const sessionExpires = userData.loginSessionExpiresAt?.toDate();
    
    return (
      userData.status === "active" && 
      sessionExpires && 
      sessionExpires > now
    );
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};