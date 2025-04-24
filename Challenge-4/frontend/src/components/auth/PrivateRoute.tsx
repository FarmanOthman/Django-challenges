import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  token: string | null;
}

export function PrivateRoute({ children, token }: PrivateRouteProps) {
  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}