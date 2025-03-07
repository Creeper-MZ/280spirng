import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ViewInfo from './components/ViewInfo';
import UpdateInfo from './components/UpdateInfo';

function App() {
    const [currentView, setCurrentView] = useState('main');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleLogin = (data) => {
        if (data.password === userData?.password &&
            (data.identifier === userData?.email || data.identifier === userData?.phone)) {
            setIsLoggedIn(true);
            setCurrentView('main');
        } else {
            alert('Invalid credentials');
        }
    };

    const handleSignUp = (data) => {
        setUserData(data);
        alert('Registration successful! Please login.');
        setCurrentView('main');
    };

    const handleUpdateInfo = (data) => {
        setUserData(prev => ({...prev, ...data}));
        alert('Information updated successfully!');
        setCurrentView('main');
    };

    const renderContent = () => {
        switch(currentView) {
            case 'login':
                return <Login onSubmit={handleLogin} onBack={() => setCurrentView('main')} />;
            case 'signup':
                return <SignUp onSubmit={handleSignUp} onBack={() => setCurrentView('main')} />;
            case 'viewInfo':
                return <ViewInfo userData={userData} onBack={() => setCurrentView('main')} />;
            case 'updateInfo':
                return <UpdateInfo userData={userData} onSubmit={handleUpdateInfo} onBack={() => setCurrentView('main')} />;
            default:
                return (
                    <div className="button-container">
                        {!isLoggedIn ? (
                            <>
                                <button className="gradient-button login" onClick={() => setCurrentView('login')}>
                                    LOGIN
                                </button>
                                <button className="gradient-button signup" onClick={() => setCurrentView('signup')}>
                                    SIGN UP
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="welcome-message">
                                    Hi, {userData.firstName}!
                                </div>
                                <button className="gradient-button view" onClick={() => setCurrentView('viewInfo')}>
                                    VIEW INFO
                                </button>
                                <button className="gradient-button update" onClick={() => setCurrentView('updateInfo')}>
                                    UPDATE INFO
                                </button>
                            </>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="App">
            <div className="App-header">
                {renderContent()}
            </div>
        </div>
    );
}

export default App;