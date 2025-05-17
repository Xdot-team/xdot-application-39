
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HardHat } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-construction-light dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-construction-primary rounded-full p-4">
            <HardHat size={48} className="text-white" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-construction-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might be under construction or has been moved.
        </p>
        <Button asChild size="lg">
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
