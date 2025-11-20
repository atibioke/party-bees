'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
  const { showToast } = useToast();

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      // Always show success for security
      setIsSent(true);
      showToast('If an account exists, an email has been sent.', 'success');
    } catch {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
      <div className="bg-[#131722] p-8 rounded-2xl border border-slate-800 max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-400">Enter your email to receive reset instructions.</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`w-full bg-[#0B0F17] border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500 transition-colors`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-500/10 text-green-400 p-4 rounded-xl border border-green-500/20">
              <p className="font-medium">Check your email!</p>
              <p className="text-sm mt-1 opacity-80">We&apos;ve sent a password reset link to your email address.</p>
            </div>
            <button 
              onClick={() => setIsSent(false)}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Didn&apos;t receive the email? Try again
            </button>
          </div>
        )}

        <div className="text-center pt-4 border-t border-slate-800/50">
          <Link href="/login" className="flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

