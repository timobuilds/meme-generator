"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/instant";
import VerifyCode from "./VerifyCode";

interface AuthButtonProps {
  onSuccess?: () => void;
}

export default function AuthButton({ onSuccess }: AuthButtonProps) {
  const { user } = db.useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && onSuccess) {
      onSuccess();
    }
  }, [user, onSuccess]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await db.auth.sendMagicCode({ email });
      setShowVerifyCode(true);
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerifyCode) {
    return <VerifyCode email={email} onBack={() => setShowVerifyCode(false)} />;
  }

  const handleGoogleSignIn = async () => {
    try {
      await (db.auth as any).signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSendCode} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="px-4 py-2 border border-[#d2d2d7] rounded-lg text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,0,0,0.1)]"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-accent text-white px-6 py-2 rounded-full border-none font-normal text-base cursor-pointer transition-all hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Sign In with Email"}
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#d2d2d7]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-[#6e6e73]">or</span>
        </div>
      </div>
      <button
        onClick={handleGoogleSignIn}
        className="px-6 py-2 border border-[#d2d2d7] rounded-full text-base text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] transition-all"
      >
        Sign In with Google
      </button>
    </div>
  );
}

