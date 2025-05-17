
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HardHat } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const { authState, login } = useAuth();
  const navigate = useNavigate();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Redirect if already logged in
  if (authState.user) {
    navigate('/dashboard');
    return null;
  }
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: FormValues) {
    if (isOfflineMode) {
      // In a real app, we would check if this user has previously logged in and has cached credentials
      // For the prototype, we'll just simulate offline login for field workers
      if (data.email.includes('field')) {
        // Note: In production, this would check against securely stored, encrypted credentials
        navigate('/dashboard');
      } else {
        form.setError('email', { 
          message: 'Offline mode is only available for field workers who have previously logged in' 
        });
      }
    } else {
      await login(data);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-construction-light dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Logo and company name */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-construction-primary rounded-full p-3">
            <HardHat size={40} className="text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">xDOTContractor</h1>
          <p className="text-muted-foreground mt-2 italic">"Construct for Centuries"</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>
              Access your xDOTContractor account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authState.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{authState.error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={authState.isLoading}
                  >
                    {authState.isLoading ? 'Logging in...' : 'Log in'}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Offline mode toggle */}
            <div className="mt-4 flex items-center justify-center">
              <Button 
                variant="link" 
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className="text-sm"
              >
                {isOfflineMode ? "Switch to online mode" : "Use offline mode (field workers)"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <div className="text-sm text-muted-foreground">
              Demo accounts:
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              admin@xdotcontractor.com / field@xdotcontractor.com / pm@xdotcontractor.com
            </div>
            <div className="text-xs text-muted-foreground">
              (Password: password)
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
