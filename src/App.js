import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ViewInfo from './components/ViewInfo';
import UpdateInfo from './components/UpdateInfo';
import EmployeeDashboard from './components/EmployeeDashboard';
import TeamManagement from './components/TeamManagement';
import ResponseTracking from './components/ResponseTracking';

// API base URL - change this to match your Python server
const API_URL = 'http://localhost:5000/api';

function App() {
    const [currentView, setCurrentView] = useState('main');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userDatabase, setUserDatabase] = useState({
        subscribers: [],
        employees: []
    });
    const [teams, setTeams] = useState([]);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    // 初始化时从API加载数据
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 请求用户数据
                const usersResponse = await fetch('/api/users');
                const usersData = await usersResponse.json();
                setUserDatabase(usersData);
                
                // 请求团队数据
                const teamsResponse = await fetch('/api/teams');
                const teamsData = await teamsResponse.json();
                setTeams(teamsData.teams || []);
                
                // 请求响应数据
                const responsesResponse = await fetch('/api/responses');
                const responsesData = await responsesResponse.json();
                setResponses(responsesData.responses || []);
            } catch (error) {
                console.error("Error loading data:", error);
                alert("Error connecting to server. Please make sure the Python API is running.");
                
                // 从localStorage加载备用数据
                const savedUsers = localStorage.getItem('erisUserDatabase');
                if (savedUsers) {
                    try {
                        setUserDatabase(JSON.parse(savedUsers));
                    } catch (e) {
                        console.error("Error parsing saved users:", e);
                    }
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
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
        // 发送新用户数据到API
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // 更新本地状态
                const updatedDb = {
                    ...userDatabase,
                    subscribers: [...userDatabase.subscribers, data]
                };
                
                setUserDatabase(updatedDb);
                localStorage.setItem('erisUserDatabase', JSON.stringify(updatedDb));
                
                alert('Registration successful! Please login.');
                setCurrentView('main');
            } else {
                alert('Error registering user. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error registering user:', error);
            
            // API请求失败时使用localStorage作为备用
            const updatedDb = {
                ...userDatabase,
                subscribers: [...userDatabase.subscribers, data]
            };
            
            setUserDatabase(updatedDb);
            localStorage.setItem('erisUserDatabase', JSON.stringify(updatedDb));
            
            alert('Registration saved locally. Please login.');
            setCurrentView('main');
        });
    };

    const handleUpdateInfo = (data) => {
        const updatedUser = {...userData, ...data};
        
        // 先更新本地状态
        if (isEmployee) {
            const updatedDb = {
                ...userDatabase,
                employees: userDatabase.employees.map(emp => 
                    (emp.email === userData.email) ? updatedUser : emp
                )
            };
            
            setUserDatabase(updatedDb);
            localStorage.setItem('erisUserDatabase', JSON.stringify(updatedDb));
        } else {
            const updatedDb = {
                ...userDatabase,
                subscribers: userDatabase.subscribers.map(sub => 
                    (sub.email === userData.email) ? updatedUser : sub
                )
            };
            
            setUserDatabase(updatedDb);
            localStorage.setItem('erisUserDatabase', JSON.stringify(updatedDb));
        }
        
        // 更新用户数据
        setUserData(updatedUser);
        
        // 然后尝试更新API
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error updating information:', error);
        });
        
        alert('Information updated successfully!');
        setCurrentView('main');
    };

    const handleTeamUpdate = (updatedTeam) => {
        // 先更新本地状态
        const newTeams = [...teams];
        const index = newTeams.findIndex(t => t.id === updatedTeam.id);
        
        if (index !== -1) {
            newTeams[index] = updatedTeam;
        } else {
            newTeams.push(updatedTeam);
        }
        
        setTeams(newTeams);
        
        // 尝试更新API
        fetch('/api/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTeam),
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error updating team:', error);
        });
        
        alert('Team updated successfully!');
    };

    const handleResponseUpdate = (updatedResponse) => {
        // 先更新本地状态
        const newResponses = [...responses];
        const index = newResponses.findIndex(r => r.id === updatedResponse.id);
        
        if (index !== -1) {
            newResponses[index] = updatedResponse;
        } else {
            newResponses.push(updatedResponse);
        }
        
        setResponses(newResponses);
        
        // 尝试更新API
        fetch('/api/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedResponse),
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error updating response:', error);
        });
        
        alert('Response updated successfully!');
    };
    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsEmployee(false);
        setCurrentView('main');
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <h2 className="eris-logo">ERIS</h2>
                    <p>Loading system data...</p>
                    <div className="loading-spinner"></div>
                </div>
            );
        }
        
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
                return <EmployeeDashboard 
                    onBack={() => setCurrentView('main')} 
                    onTeamsClick={() => setCurrentView('teamManagement')}
                    onResponsesClick={() => setCurrentView('responseTracking')}
                />;
            case 'teamManagement':
                return <TeamManagement 
                    teams={teams}
                    onTeamUpdate={handleTeamUpdate}
                    onBack={() => setCurrentView('employeeDashboard')} 
                />;
            case 'responseTracking':
                return <ResponseTracking 
                    responses={responses}
                    teams={teams}
                    onResponseUpdate={handleResponseUpdate}
                    onBack={() => setCurrentView('employeeDashboard')} 
                />;
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