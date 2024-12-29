import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setUser } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (pwd: string) => {
    return pwd.length >= 6;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = email.split('@')[0];
      
      // Set the displayName in Firebase Auth
      await updateProfile(result.user, {
        displayName: displayName
      });
      
      dispatch(setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName,
        photoURL: null
      }));
      navigate('/share');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email or sign in.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      console.error('Error signing up:', error);
    }
};

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center">
        <h2 className="mb-4">Sign Up</h2>
        
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        
        <form onSubmit={handleSignUp} className="mb-4 w-100" style={{maxWidth: "400px"}}>
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
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Sign Up with Email
          </button>
        </form>

        <Link to="/login" className="btn btn-link">
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
