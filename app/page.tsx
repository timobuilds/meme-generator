"use client";

import Link from "next/link";
import { db } from "@/lib/instant";
import MemeCard from "@/components/MemeCard";
import type { Meme } from "@/lib/types";
import NextImage from "next/image";

export default function LandingPage() {
  const { data } = db.useQuery({
    memes: {},
  });

  const memes: Meme[] = ((data?.memes || []) as any[]).map((meme) => ({
    ...meme,
    textState: typeof meme.textState === "string" ? JSON.parse(meme.textState) : meme.textState,
    upvoteUserIds: typeof meme.upvoteUserIds === "string" ? JSON.parse(meme.upvoteUserIds) : meme.upvoteUserIds,
  })) as Meme[];
  const topMemes = [...memes]
    .sort((a, b) => b.upvoteUserIds.length - a.upvoteUserIds.length)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-semibold mb-6 text-[#1d1d1f] tracking-tight leading-tight">
              Unleash Your Inner Meme Lord
            </h1>
            <p className="text-2xl md:text-3xl text-[#6e6e73] font-normal leading-relaxed max-w-3xl mx-auto mb-10">
              Create, share, and upvote the dankest memes on the internet. Simple, fast, and free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/create"
                className="px-8 py-4 bg-accent text-white rounded-full text-lg font-medium hover:bg-accent-hover transition-all hover:scale-105 active:scale-95"
              >
                Start Creating
              </Link>
              <Link
                href="/feed"
                className="px-8 py-4 border-2 border-[#1d1d1f] text-[#1d1d1f] rounded-full text-lg font-medium hover:bg-[#1d1d1f] hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                View Feed
              </Link>
            </div>
          </div>

          {/* Meme Collage Preview */}
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mt-16">
            {["/samples/image.png", "/samples/image copy.png", "/samples/image copy 2.png"].map(
              (src, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <NextImage
                    src={src}
                    alt={`Sample meme ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features / How It Works */}
      <section className="py-24 px-5 bg-[#fbfbfd]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-16 text-[#1d1d1f]">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload or Select",
                description: "Choose from our curated templates or upload your own image. It's that simple.",
                icon: "📸",
              },
              {
                step: "2",
                title: "Customize Text",
                description: "Add your own text, adjust colors, fonts, and positions with our intuitive editor.",
                icon: "✏️",
              },
              {
                step: "3",
                title: "Share & Upvote",
                description: "Post your creation and watch it climb the ranks. Magic link login - no passwords needed!",
                icon: "🚀",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <div className="text-sm font-semibold text-accent mb-2">STEP {feature.step}</div>
                <h3 className="text-2xl font-semibold mb-4 text-[#1d1d1f]">{feature.title}</h3>
                <p className="text-[#6e6e73] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feed Preview */}
      {topMemes.length > 0 && (
        <section className="py-24 px-5">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-semibold text-[#1d1d1f]">Trending Now</h2>
              <Link
                href="/feed"
                className="text-lg text-accent hover:text-accent-hover transition-colors font-medium"
              >
                See More →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {topMemes.map((meme) => (
                <MemeCard key={meme.id} meme={meme} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 px-5 bg-[#fbfbfd]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-4 text-[#1d1d1f]">
            Join thousands of creators
          </h2>
          <p className="text-xl text-center text-[#6e6e73] mb-12">
            See what our community is saying
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Finally, a meme generator that doesn't make me want to throw my computer out the window. Love it!",
                author: "Alex M.",
                role: "Meme Enthusiast",
              },
              {
                quote:
                  "The magic link login is genius. No more forgotten passwords, just pure meme-making bliss.",
                author: "Sarah K.",
                role: "Content Creator",
              },
              {
                quote:
                  "I've made more memes in one day here than I have in my entire life. This is addictive!",
                author: "Mike T.",
                role: "Digital Artist",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">💬</div>
                <p className="text-[#1d1d1f] mb-6 leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <div className="font-semibold text-[#1d1d1f]">{testimonial.author}</div>
                  <div className="text-sm text-[#6e6e73]">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d2d2d7] py-12 px-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[#6e6e73] text-sm">
              © {new Date().getFullYear()} Meme Generator. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link
                href="/create"
                className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
              >
                Create
              </Link>
              <Link
                href="/feed"
                className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
              >
                Feed
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
