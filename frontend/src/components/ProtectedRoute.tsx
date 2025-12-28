import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    //Check if user is authenticated
    if (!isAuthenticated()) {
      console.log(' Not authenticated, redirecting to login...');
      router.push('/login');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  //Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
