import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebase/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setUser } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { client } from '../../apollo/client';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // If no displayName exists, set it now
      if (!result.user.displayName) {
        await updateProfile(result.user, {
          displayName: email.split('@')[0]
        });
      }
      
      dispatch(setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || email.split('@')[0],
        photoURL: result.user.photoURL
      }));
      client.refetchQueries({ include: ['GetPatterns'] });
      navigate('/share');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

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
      client.refetchQueries({ include: ['GetPatterns'] });
      navigate('/share');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center">
        <h2 className="mb-4">Sign In</h2>

        <form onSubmit={handleEmailSignIn} className="mb-4 w-100" style={{ maxWidth: '400px' }}>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Sign In with Email
          </button>
        </form>

        <button
          className="btn btn-outline-light d-flex align-items-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <i className="bi bi-google"></i>
          Sign in with Google
        </button>

        <Link to="/signup" className="btn btn-link mt-3">
          Need an account? Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;

