import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import AudioWorkspace from './components/AudioWorkspace';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <div className="App bg-dark text-light pb-5">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<AudioWorkspace />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
