import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import AudioWorkspace from './components/AudioWorkspace'
import { Provider, useDispatch } from 'react-redux';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { resetModuleReadyStates } from './store/videoModuleSlice';
import { useEffect } from 'react';

// Create a wrapped component that can use hooks
const AppContent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetModuleReadyStates());
    }, []);

    return (
        <div className="App">
            <AudioWorkspace />
        </div>
    );
}

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppContent />
            </PersistGate>
        </Provider>
    );
}

export default App;
