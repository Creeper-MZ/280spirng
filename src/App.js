import { useState, useEffect } from 'react';
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
    const [userDatabase, setUserDatabase] = useState({
        subscribers: [],
        employees: [
            {
                email: 'employee@eris.com',
                phone: '1234567890',
                password: 'employee123',
                firstName: 'ERIS',
                lastName: 'Employee',
                isEmployee: true
            }
        ]
    });

    // Load user database from localStorage on initial render
    useEffect(() => {
        const savedData = localStorage.getItem('erisUserDatabase');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setUserDatabase(parsedData);
            } catch (e) {
                console.error("Error loading saved data:", e);
            }
        }
    }, []);

    // Save user database to localStorage and export to text file
    const saveUserDatabase = (updatedDb) => {
        // Save to localStorage
        localStorage.setItem('erisUserDatabase', JSON.stringify(updatedDb));
        
        // Export to text file
        const dataStr = JSON.stringify(updatedDb, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'text/plain'});
        
        // Create a download link and trigger it
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(dataBlob);
        downloadLink.download = 'eris_users.txt';
        downloadLink.click();
    };

    // Import user database from text file
    const importUserDatabase = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const importedData = JSON.parse(content);
                setUserDatabase(importedData);
                localStorage.setItem('erisUserDatabase', content);
                alert('User database imported successfully!');
            } catch (err) {
                alert('Error importing file: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    const handleLogin = (data) => {
        if (data.isEmployee) {
            // Check against employees list
            const employee = userDatabase.employees.find(emp => 
                emp.password === data.password && 
                (emp.email === data.identifier || emp.phone === data.identifier)
            );
            
            if (employee) {
                setIsLoggedIn(true);
                setIsEmployee(true);
                setUserData(employee);
                setCurrentView('main');
            } else {
                alert('Invalid employee credentials');
            }
        } else {
            // Check against subscribers list
            const subscriber = userDatabase.subscribers.find(sub => 
                sub.password === data.password && 
                (sub.email === data.identifier || sub.phone === data.identifier)
            );
            
            if (subscriber) {
                setIsLoggedIn(true);
                setIsEmployee(false);
                setUserData(subscriber);
                setCurrentView('main');
            } else {
                alert('Invalid credentials');
            }
        }
    };

    const handleSignUp = (data) => {
        // Add the new user to subscribers list
        const updatedDb = {
            ...userDatabase,
            subscribers: [...userDatabase.subscribers, data]
        };
        
        setUserDatabase(updatedDb);
        saveUserDatabase(updatedDb);
        
        alert('Registration successful! Please login.');
        setCurrentView('main');
    };

    const handleUpdateInfo = (data) => {
        // Update user data in the appropriate list
        let updatedDb;
        
        if (isEmployee) {
            updatedDb = {
                ...userDatabase,
                employees: userDatabase.employees.map(emp => 
                    (emp.email === userData.email) ? {...emp, ...data} : emp
                )
            };
        } else {
            updatedDb = {
                ...userDatabase,
                subscribers: userDatabase.subscribers.map(sub => 
                    (sub.email === userData.email) ? {...sub, ...data} : sub
                )
            };
        }
        
        setUserDatabase(updatedDb);
        setUserData(prevData => ({...prevData, ...data}));
        localStorage.setItem('erisUserDatabase', JSON.stringify(updatedDb));
        
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
                                    <h1 className="eris-logo">ERIS</h1>
                                    <p className="eris-subtitle">Emergency Response Information System</p>
                                </div>
                                <button className="gradient-button login" onClick={() => setCurrentView('login')}>
                                    LOGIN
                                </button>
                                <button className="gradient-button signup" onClick={() => setCurrentView('signup')}>
                                    SIGN UP
                                </button>
                                <div className="admin-controls">
                                    <input
                                        type="file"
                                        id="import-database"
                                        accept=".txt"
                                        style={{ display: 'none' }}
                                        onChange={importUserDatabase}
                                    />
                                    <label className="admin-link" htmlFor="import-database">
                                        Import User Database
                                    </label>
                                </div>
                            </>
                        ) : isEmployee ? (
                            <>
                                <div className="welcome-message">
                                    Welcome, {userData.firstName}!
                                </div>
                                <button className="gradient-button employee" onClick={() => setCurrentView('employeeDashboard')}>
                                    EMPLOYEE DASHBOARD
                                </button>
                                <button className="gradient-button view" onClick={() => setCurrentView('viewInfo')}>
                                    MY PROFILE
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

    return (
        <div className="App">
            <div className="App-header">
                {renderContent()}
            </div>
        </div>
    );
}

export default App;