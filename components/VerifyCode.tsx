"use client";

import { useState } from "react";
import { db } from "@/lib/instant";

interface VerifyCodeProps {
  email: string;
  onBack: () => void;
}

export default function VerifyCode({ email, onBack }: VerifyCodeProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium text-[#6e6e73] mb-2">
          Enter 6-digit code sent to {email}
        </label>
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="000000"
          maxLength={6}
          required
          className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg text-base text-center text-2xl tracking-widest focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,0,0,0.1)]"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-[#d2d2d7] rounded-lg text-base text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] transition-all"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="flex-1 bg-accent text-white px-6 py-2 rounded-lg border-none font-normal text-base cursor-pointer transition-all hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </form>
  );
}

