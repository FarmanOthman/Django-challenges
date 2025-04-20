import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

function AuthStatus() {
  const { user, logout } = useAuth();

  return (
    <div className="auth-status">
      {user ? (
        <div>
          <p>Logged in as: {user.username}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <h1>Authentication Test</h1>
        <AuthStatus />
        
        <div className="auth-forms">
          <div className="form-section">
            <h2>Login</h2>
            <LoginForm />
          </div>
          
          <div className="form-section">
            <h2>Register</h2>
            <RegisterForm />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
