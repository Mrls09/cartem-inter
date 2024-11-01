// components/PrivateRoute.tsx
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, ReactNode, FC } from 'react';

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return user ? <>{children}</> : null;
};

export default PrivateRoute;
