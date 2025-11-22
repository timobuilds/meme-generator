"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/instant";
import MemeCard from "@/components/MemeCard";
import type { Meme } from "@/lib/types";
import Link from "next/link";

type SortOption = "recent" | "popular";

export default function FeedPage() {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [fullscreenMeme, setFullscreenMeme] = useState<Meme | null>(null);
  const { data, isLoading } = db.useQuery({
    memes: {},
  });

  const memes: Meme[] = data?.memes || [];

  const sortedMemes = [...memes].sort((a, b) => {
    if (sortBy === "popular") {
      return b.upvoteUserIds.length - a.upvoteUserIds.length;
    }
    return b.createdAt - a.createdAt;
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreenMeme(null);
      }
    };

    if (fullscreenMeme) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [fullscreenMeme]);

  return (
    <div className="min-h-screen bg-white py-12 px-5">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-semibold text-[#1d1d1f] tracking-tight">
            Meme Feed
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy("recent")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === "recent"
                  ? "bg-[#1d1d1f] text-white"
                  : "bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e8e8ed]"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === "popular"
                  ? "bg-[#1d1d1f] text-white"
                  : "bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e8e8ed]"
              }`}
            >
              Popular
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-black/5 animate-pulse"
              >
                <div className="w-full h-64 bg-[#e8e8ed]"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#e8e8ed] rounded w-3/4"></div>
                  <div className="h-4 bg-[#e8e8ed] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedMemes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-30">📭</div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2">
              No memes yet
            </h2>
            <p className="text-[#6e6e73] mb-6">
              Be the first to post a meme!
            </p>
            <Link
              href="/create"
              className="inline-block bg-accent text-white px-6 py-3 rounded-full hover:bg-accent-hover transition-all"
            >
              Create Meme
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMemes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                onClick={() => setFullscreenMeme(meme)}
              />
            ))}
          </div>
        )}

        {fullscreenMeme && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setFullscreenMeme(null)}
          >
            <button
              onClick={() => setFullscreenMeme(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors text-2xl font-light"
              aria-label="Close"
            >
              ✕
            </button>
            <div
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fullscreenMeme.imageData}
                alt="Meme"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

