'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'sent'>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const { showToast } = useToast();

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/auth/verify-email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We don't need body if user is logged in, API checks session
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast('Verification email resent!', 'success');
      } else {
        showToast(data.error || 'Failed to resend email', 'error');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!token) {
      // If no token, show "Check your email" state instead of error
      setStatus('sent'); 
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch {
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
      <div className="bg-[#131722] p-8 rounded-2xl border border-slate-800 max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-white">Verifying...</h1>
            <p className="text-slate-400">Please wait while we verify your email address.</p>
          </>
        )}
        {status === 'sent' && (
          <>
            <div className="bg-pink-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-pink-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Verify your email</h1>
            <p className="text-slate-400">
              We&apos;ve sent a verification link to your email address. <br />
              Please check your inbox and click the link to continue.
            </p>
            <div className="pt-4 border-t border-slate-800/50 mt-6">
              <p className="text-sm text-slate-500">
                Didn&apos;t receive the email?{' '}
                <button 
                  onClick={handleResend}
                  disabled={resending}
                  className="text-pink-500 hover:text-pink-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? 'Resending...' : 'Click to resend'}
                </button>
              </p>
            </div>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-white">Email Verified!</h1>
            <p className="text-slate-400">Your email has been successfully verified. You can now access all features.</p>
            <Link href="/dashboard">
              <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full">
                Go to Dashboard
              </button>
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-white">Verification Failed</h1>
            <p className="text-slate-400">{message}</p>
            <Link href="/contact">
              <button className="text-pink-500 hover:text-pink-400 font-medium mt-4">
                Contact Support
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

