import { init } from "@instantdb/react";
import type { Schema } from "./types";

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID;

if (!APP_ID) {
  throw new Error(
    "Missing NEXT_PUBLIC_INSTANTDB_APP_ID environment variable. Please check your .env.local file."
  );
}

export const db = init<Schema>({
  appId: APP_ID,
});

