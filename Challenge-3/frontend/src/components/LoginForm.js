import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const LoginForm = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    const result = await login(data.username, data.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && (
          <span className="error">{errors.username.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm; 