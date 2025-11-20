'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ password: string; confirmPassword: string }>();
  const { showToast } = useToast();

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (!token) {
      showToast('Invalid or missing token', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });
      
      const result = await res.json();

      if (res.ok && result.success) {
        showToast('Password reset successfully', 'success');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        showToast(result.error || 'Failed to reset password', 'error');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="bg-[#131722] p-8 rounded-2xl border border-slate-800 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-slate-400 mb-6">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password">
            <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full">
              Request New Link
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
      <div className="bg-[#131722] p-8 rounded-2xl border border-slate-800 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">New Password</h1>
          <p className="text-slate-400">Create a new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 8, message: "Must be at least 8 characters" }
                })}
                className={`w-full bg-[#0B0F17] border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500 transition-colors`}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: (val: string) => {
                    if (watch('password') != val) {
                      return "Your passwords do not match";
                    }
                  }
                })}
                className={`w-full bg-[#0B0F17] border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500 transition-colors`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800/50">
          <Link href="/login" className="flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

