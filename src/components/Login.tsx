import React from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { setUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      dispatch(setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      }));
      navigate('/'); // maybe later this will take us to pattern sharing page

    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center">
        <h2 className="mb-4">Sign In</h2>
        <button 
          className="btn btn-outline-light d-flex align-items-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <i className="bi bi-google"></i>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
