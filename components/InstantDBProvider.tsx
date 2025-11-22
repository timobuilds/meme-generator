"use client";

import { db } from "@/lib/instant";

export default function InstantDBProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // InstantDB React doesn't require a Provider wrapper
  // The init() call sets up the global context
  return <>{children}</>;
}

