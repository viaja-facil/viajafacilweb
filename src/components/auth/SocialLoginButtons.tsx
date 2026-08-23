"use client";

import { useState } from "react";
import { useAuth, SocialProvider } from "@/lib/auth-context";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

interface SocialLoginButtonsProps {
  onSuccess?: () => void;
}

export default function SocialLoginButtons({ onSuccess }: SocialLoginButtonsProps) {
  const { loginSocial } = useAuth();
  const [isLoading, setIsLoading] = useState<SocialProvider | null>(null);

  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsLoading(provider);
    await new Promise((r) => setTimeout(r, 800));
    loginSocial(provider);
    onSuccess?.();
    setIsLoading(null);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading !== null}
        className="w-full min-h-[48px] flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition-colors disabled:opacity-60"
      >
        {isLoading === "google" ? (
          <div className="w-5 h-5 border-2 border-gray-200 border-t-[#f97316] rounded-full animate-spin" />
        ) : (
          <>
            <GoogleIcon />
            Continuar com Google
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => handleSocialLogin("facebook")}
        disabled={isLoading !== null}
        className="w-full min-h-[48px] flex items-center justify-center gap-3 py-3 bg-[#1877F2] hover:bg-[#166fe5] rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60"
      >
        {isLoading === "facebook" ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <FacebookIcon />
            Continuar com Facebook
          </>
        )}
      </button>
    </div>
  );
}
