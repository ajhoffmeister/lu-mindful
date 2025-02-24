import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { createUserDocument, updateUserSession } from '../../firebase/users';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register

  //need ethnicity setting
  const [ethnicity, setEthnicity] = useState('');

  // Function to validate Lehigh email
  const isLehighEmail = (email) => {
      return email.toLowerCase().endsWith('@lehigh.edu');
  };

  // handles loging in with email address
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate Lehigh email
    if (!isLehighEmail(email)) {
      setError('Please use your Lehigh email address ending in @lehigh.edu');
      setLoading(false);
      return;
    }

    console.log("validated email is lehigh")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("validated user credentials")
      await updateUserSession(userCredential.user.uid);
      console.log("updated user session")
      // Store user info in localStorage
      localStorage.setItem('lehighmindful_user', JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          ethnicity: ethnicity
      }));
      console.log("local storage updated")
      navigate('/content');
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this Lehigh email. Please register first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        default:
          errorMessage = error.message;
      }
    setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate Lehigh email
    if (!isLehighEmail(email)) {
      setError('Registration is only available with a Lehigh email address (@lehigh.edu)');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await createUserDocument(user);

      console.log("created user document");

      // save user data to firestore
      await setDoc(doc(db, 'users_lehigh', user.uid), {
        uid: user.uid,
        email: user.email,
        ethnicity: ethnicity,
      });

      console.log("added user data to firestore");

      await updateUserSession(userCredential.user.uid);

      console.log("updated user session");

      navigate('/content');

    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This Lehigh email is already registered. Please log in instead.';
          setIsLogin(true);
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid Lehigh email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleEmailLogin : handleEmailRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!isLogin && (
            <div>
            <label className="block text-gray-700 mb-2">Select Race or Ethnicity</label>
              <select 
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className={ethnicity === "" ? "text-gray-500 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" : "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                required
              >
                <option value="" disabled></option>
                <option value="black">African American/Black</option>
                <option value="asian">Asian/Asian American</option>
                <option value="latino">Hispanic/Latino</option>
                <option value="navam">Native American</option>
                <option value="pacisl">Hawaiian/Pacific Islander</option>
                <option value="white">White/Caucasian</option>
                <option value="mideas">Middle Eastern/North African</option>
                <option value="indian">Indian/South Asian</option>
              </select>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </div>

        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};
  
export default Login;