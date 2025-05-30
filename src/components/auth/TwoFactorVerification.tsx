
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Mail, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface TwoFactorVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function TwoFactorVerification({ email, onSuccess, onBack }: TwoFactorVerificationProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms'>('email');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate verification - in real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (code === '123456') { // Demo code
        toast.success('Verification successful!');
        onSuccess();
      } else {
        toast.error('Invalid verification code. Please try again.');
        setCode('');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Simulate resending code
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Verification code sent to your ${verificationMethod}`);
      setTimeLeft(60);
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Account</h1>
          <p className="text-blue-200">Enter the verification code we sent you</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle className="text-xl text-slate-800">Two-Factor Verification</CardTitle>
                <CardDescription className="text-slate-600">
                  Code sent to {email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Verification Method Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={verificationMethod === 'email' ? 'default' : 'outline'}
                onClick={() => setVerificationMethod('email')}
                className="flex-1"
                size="sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={verificationMethod === 'sms' ? 'default' : 'outline'}
                onClick={() => setVerificationMethod('sms')}
                className="flex-1"
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                SMS
              </Button>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-4">
                  Enter the 6-digit code sent to your {verificationMethod}
                </p>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                    onComplete={() => {
                      // Auto-verify when code is complete
                      if (code.length === 6) {
                        handleVerify();
                      }
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleVerify}
                className="w-full bg-blue-900 hover:bg-blue-800 transition-all duration-200"
                disabled={isVerifying || code.length !== 6}
              >
                {isVerifying ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>

            {/* Resend Code */}
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={isResending || timeLeft > 0}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : timeLeft > 0 ? (
                  `Resend in ${timeLeft}s`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>

            {/* Demo Helper */}
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-xs text-blue-600">
                <strong>Demo:</strong> Use code <code className="font-mono">123456</code> to verify
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
