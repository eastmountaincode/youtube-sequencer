import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import AudioWorkspace from './components/AudioWorkspace';
import { Provider, useDispatch } from 'react-redux';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import Login from './components/Login';
import { setUser } from './store/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from './firebase/firebase';
import SharePatterns from './components/SharePatterns/SharePatterns';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';

function App() {

  return (
    <ApolloProvider client={client}>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthStateManager />

          <BrowserRouter>
            <div className="App bg-dark text-light pb-5">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<AudioWorkspace />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/share" element={<SharePatterns />} />

                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ApolloProvider>

  );
}

export default App;

// Separate component to handle auth state
const AuthStateManager = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // onAuthStateChanged is a Firebase function that listens
    // for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

