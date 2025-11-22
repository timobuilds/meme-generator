"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/instant";
import AuthButton from "./AuthButton";

export default function Navigation() {
  const { user } = db.useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleSignOut = async () => {
    await db.auth.signOut();
  };

  return (
    <nav className="border-b border-[#d2d2d7] bg-white sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-[#1d1d1f]">
            Meme Generator
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/create"
              className="text-base text-[#6e6e73] hover:text-[#1d1d1f] transition-colors hidden sm:block"
            >
              Create
            </Link>
            <Link
              href="/feed"
              className="text-base text-[#6e6e73] hover:text-[#1d1d1f] transition-colors hidden sm:block"
            >
              Feed
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#6e6e73] hidden md:block truncate max-w-[150px]">
                  {user.email || user.id}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 border border-[#d2d2d7] rounded-lg text-sm text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowAuth(!showAuth)}
                  className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-all"
                >
                  Sign In
                </button>
                {showAuth && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowAuth(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#d2d2d7] p-4 z-50">
                      <AuthButton onSuccess={() => setShowAuth(false)} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

