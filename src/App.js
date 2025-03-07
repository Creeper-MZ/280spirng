import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ViewInfo from './components/ViewInfo';
import UpdateInfo from './components/UpdateInfo';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
    const [currentView, setCurrentView] = useState('main');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [userData, setUserData] = useState(null);
    
    // Mock employee data for demo
    const employeeCredentials = {
        email: 'employee@eris.com',
        phone: '1234567890',
        password: 'employee123',
        firstName: 'ERIS',
        lastName: 'Employee'
    };

    const handleLogin = (data) => {
        if (data.isEmployee) {
            // Handle employee login
            if (data.password === employeeCredentials.password && 
                (data.identifier === employeeCredentials.email || data.identifier === employeeCredentials.phone)) {
                setIsLoggedIn(true);
                setIsEmployee(true);
                setUserData(employeeCredentials);
                setCurrentView('main');
            } else {
                alert('Invalid employee credentials');
            }
        } else {
            // Handle subscriber login
            if (userData && data.password === userData.password &&
                (data.identifier === userData.email || data.identifier === userData.phone)) {
                setIsLoggedIn(true);
                setIsEmployee(false);
                setCurrentView('main');
            } else {
                alert('Invalid credentials');
            }
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

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsEmployee(false);
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
            case 'employeeDashboard':
                return <EmployeeDashboard onBack={() => setCurrentView('main')} />;
            default:
                return (
                    <div className="button-container">
                        {!isLoggedIn ? (
                            <>
                                <div className="logo-container main-logo">
                                    <img src="/eris-logo.png" alt="ERIS Logo" className="system-logo" />
                                    <h1>Emergency Response Information System</h1>
                                </div>
                                <button className="gradient-button login" onClick={() => setCurrentView('login')}>
                                    LOGIN
                                </button>
                                <button className="gradient-button signup" onClick={() => setCurrentView('signup')}>
                                    SIGN UP
                                </button>
                            </>
                        ) : isEmployee ? (
                            <>
                                <div className="welcome-message">
                                    Welcome, ERIS Employee!
                                </div>
                                <button className="gradient-button employee" onClick={() => setCurrentView('employeeDashboard')}>
                                    EMPLOYEE DASHBOARD
                                </button>
                                <button className="gradient-button logout" onClick={handleLogout}>
                                    LOGOUT
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
                                <button className="gradient-button logout" onClick={handleLogout}>
                                    LOGOUT
                                </button>
                            </>
                        )}
                    </div>
                );
        }
    };

    // Create a placeholder ERIS logo
    const createERISLogo = () => {
        // Check if we need to create a placeholder logo
        const img = new Image();
        img.src = '/eris-logo.png';
        
        img.onerror = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            // Draw a circle background
            ctx.beginPath();
            ctx.arc(100, 100, 90, 0, 2 * Math.PI);
            ctx.fillStyle = '#2a5298';
            ctx.fill();
            
            // Draw a star (emergency symbol)
            ctx.beginPath();
            ctx.moveTo(100, 30);
            for (let i = 1; i < 5; i++) {
                ctx.lineTo(
                    100 + 70 * Math.cos((0.5 * i * 2 * Math.PI) / 5 - Math.PI / 2),
                    100 + 70 * Math.sin((0.5 * i * 2 * Math.PI) / 5 - Math.PI / 2)
                );
                ctx.lineTo(
                    100 + 30 * Math.cos(((0.5 * i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2),
                    100 + 30 * Math.sin(((0.5 * i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2)
                );
            }
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();
            
            // Add "ERIS" text
            ctx.font = 'bold 36px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('ERIS', 100, 100);
            
            // Convert to data URL and save as image
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'eris-logo.png';
            
            // Create a temporary image in public folder (for demo purposes only)
            // In a real app, you'd save this properly to the server
            const img = document.createElement('img');
            img.src = dataURL;
            img.style.display = 'none';
            img.id = 'temp-logo';
            document.body.appendChild(img);
        };
    };
    
    // Run once when component mounts
    useState(() => {
        createERISLogo();
    }, []);

    return (
        <div className="App">
            <div className="App-header">
                {renderContent()}
            </div>
        </div>
    );
}

export default App;