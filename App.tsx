
import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SecuritySetup from './components/SecuritySetup';
import { AuthState, Student } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    stage: 'login'
  });

  const handleInitialLogin = (user: Student) => {
    // Check local storage for existing secure profile
    const savedUserStr = localStorage.getItem(`lasusphere_user_${user.matricNo}`);
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
    
    const activeUser = savedUser || user;

    if (!activeUser.setupComplete) {
      setAuth({ 
        isAuthenticated: true, 
        user: activeUser,
        stage: 'setup'
      });
    } else {
      setAuth({ 
        isAuthenticated: true, 
        user: activeUser,
        stage: 'dashboard'
      });
    }
  };

  const handleSetupComplete = (updatedUser: Student) => {
    setAuth({
      isAuthenticated: true,
      user: updatedUser,
      stage: 'dashboard'
    });
  };

  const handleLogout = () => {
    setAuth({ 
      isAuthenticated: false, 
      user: null,
      stage: 'login'
    });
  };

  if (auth.stage === 'login') {
    return <Login onLogin={handleInitialLogin} />;
  }

  if (auth.stage === 'setup') {
    return <SecuritySetup user={auth.user!} onComplete={handleSetupComplete} />;
  }

  return <Dashboard user={auth.user!} onLogout={handleLogout} />;
};

export default App;
