
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  useEffect(() => {
    // If user is logged in, go to dashboard, otherwise to login
    if (!authState.isLoading) {
      if (authState.user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [navigate, authState.isLoading, authState.user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    </div>
  );
};

export default Index;
