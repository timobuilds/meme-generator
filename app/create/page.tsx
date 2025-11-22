"use client";

import MemeGenerator from "@/components/MemeGenerator";
import { db } from "@/lib/instant";
import AuthButton from "@/components/AuthButton";

export default function CreatePage() {
  const { user } = db.useAuth();

  return (
    <div className="min-h-screen bg-white py-12 px-5">
      <div className="max-w-[1400px] mx-auto">
        <header className="text-center mb-20">
          <h1 className="text-5xl font-semibold mb-3 text-[#1d1d1f] tracking-tight leading-tight">
            Meme Generator
          </h1>
          <p className="text-xl text-[#6e6e73] font-normal leading-relaxed">
            Create memes with custom text and styling
          </p>
        </header>

        {user ? (
          <MemeGenerator />
        ) : (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 opacity-30">🔒</div>
              <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2">
                Sign in required
              </h2>
              <p className="text-[#6e6e73] mb-8">
                You must be signed in to create and share memes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#d2d2d7]">
              <AuthButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

