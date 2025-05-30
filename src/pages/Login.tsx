
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types/auth';
import { Building2, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { TwoFactorVerification } from '@/components/auth/TwoFactorVerification';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';
import { toast } from 'sonner';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [accountType, setAccountType] = useState<'individual' | 'corporate'>('individual');
  const [show2FA, setShow2FA] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    companyName: '',
    companyAddress: '',
    acceptTerms: false
  });

  const { login, authState } = useAuth();

  // Fade in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.login-container')?.classList.add('animate-fade-in');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate 2FA requirement for demo
      setShow2FA(true);
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.acceptTerms) {
      toast.error('Please accept the terms of service');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate registration success
      toast.success('Account created successfully! Please verify your account.');
      setShow2FA(true);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASuccess = async () => {
    try {
      await login(credentials);
      setShow2FA(false);
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    }
  };

  if (show2FA) {
    return (
      <TwoFactorVerification
        email={credentials.email || registerData.email}
        onSuccess={handle2FASuccess}
        onBack={() => setShow2FA(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="login-container opacity-0 transition-all duration-700 ease-out transform translate-y-4">
        <div className="w-full max-w-md mx-auto">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-blue-900" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">xDOTContractor</h1>
            <p className="text-blue-200">Construction ERP Excellence</p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {isRegistering 
                  ? 'Join the future of construction management'
                  : 'Sign in to your xDOTContractor account'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isRegistering ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={credentials.email}
                        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-900 hover:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Account Type Selection */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={accountType === 'individual' ? 'default' : 'outline'}
                      onClick={() => setAccountType('individual')}
                      className="flex-1"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Individual
                    </Button>
                    <Button
                      type="button"
                      variant={accountType === 'corporate' ? 'default' : 'outline'}
                      onClick={() => setAccountType('corporate')}
                      className="flex-1"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Corporate
                    </Button>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    {accountType === 'corporate' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-slate-700">Company Name</Label>
                          <Input
                            id="companyName"
                            placeholder="Enter company name"
                            value={registerData.companyName}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, companyName: e.target.value }))}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyAddress" className="text-slate-700">Company Address</Label>
                          <Input
                            id="companyAddress"
                            placeholder="Enter company address"
                            value={registerData.companyAddress}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, companyAddress: e.target.value }))}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-700">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerEmail" className="text-slate-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="registerEmail"
                          type="email"
                          placeholder="Enter your email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-slate-700">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={registerData.phoneNumber}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerPassword" className="text-slate-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="registerPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={registerData.acceptTerms}
                        onCheckedChange={(checked) => setRegisterData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                      />
                      <Label htmlFor="terms" className="text-sm text-slate-600">
                        I accept the <button type="button" className="text-blue-600 hover:underline">Terms of Service</button> and <button type="button" className="text-blue-600 hover:underline">Privacy Policy</button>
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-900 hover:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <SocialAuthButtons onSuccess={handle2FASuccess} />

                <div className="text-center space-y-2">
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-600 hover:underline transition-colors"
                    >
                      Forgot your password?
                    </button>
                  )}
                  
                  <div className="text-sm text-slate-600">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-blue-600 hover:underline font-medium transition-colors"
                    >
                      {isRegistering ? 'Sign in' : 'Create one'}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </div>
  );
}
