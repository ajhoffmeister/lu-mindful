import { auth } from './config';
import { signOut } from 'firebase/auth';

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: error.message };
  }
};