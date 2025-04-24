import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContainer } from './components/auth/AuthContainer';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { RoomPage } from './components/chat/RoomPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { token, setToken, logout } = useAuth();

  const handleAuthSuccess = (accessToken: string) => {
    setToken(accessToken);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/chat" replace />
            ) : (
              <AuthContainer onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute token={token}>
              <RoomPage token={token || ''} onLogout={logout} />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
