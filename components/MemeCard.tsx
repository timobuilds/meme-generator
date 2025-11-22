"use client";

import { db } from "@/lib/instant";
import type { Meme } from "@/lib/types";
import { useState } from "react";

interface MemeCardProps {
  meme: Meme;
  onClick?: () => void;
}

export default function MemeCard({ meme, onClick }: MemeCardProps) {
  const { user } = db.useAuth();
  const [isUpvoting, setIsUpvoting] = useState(false);

  const hasUpvoted = user ? meme.upvoteUserIds.includes(user.id) : false;
  const upvoteCount = meme.upvoteUserIds.length;

  const handleUpvote = async () => {
    if (!user) return;

    setIsUpvoting(true);
    try {
      const newUpvoteUserIds = hasUpvoted
        ? meme.upvoteUserIds.filter((id) => id !== user.id)
        : [...meme.upvoteUserIds, user.id];

      await db.transact(db.tx.memes[meme.id].update({ upvoteUserIds: JSON.stringify(newUpvoteUserIds) }));
    } catch (error) {
      console.error("Failed to upvote:", error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-black/5 hover:shadow-lg transition-all">
      <div className="relative w-full aspect-auto">
        <img
          src={meme.imageData}
          alt={`Meme by ${meme.userName}${meme.topText || meme.bottomText ? `: ${meme.topText || ""} ${meme.bottomText || ""}`.trim() : ""}`}
          className="w-full h-auto object-contain cursor-pointer"
          onClick={onClick}
          loading="lazy"
          decoding="async"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUpvote();
          }}
          disabled={!user || isUpvoting}
          aria-label={hasUpvoted ? `Remove upvote (${upvoteCount} upvotes)` : `Upvote meme (${upvoteCount} upvotes)`}
          title={!user ? "Sign in to upvote" : hasUpvoted ? "Remove upvote" : "Upvote"}
          className={`absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all backdrop-blur-sm ${
            hasUpvoted
              ? "bg-red-500/90 text-white hover:bg-red-600/90"
              : "bg-white/90 text-[#1d1d1f] hover:bg-white"
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50`}
        >
          <span className="text-base" aria-hidden="true">{hasUpvoted ? "❤️" : "🤍"}</span>
          <span>{upvoteCount}</span>
        </button>
      </div>
    </div>
  );
}

